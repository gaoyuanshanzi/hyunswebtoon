'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Step1Input from '@/components/Step1Input';
import Step2StoryboardEditor from '@/components/Step2StoryboardEditor';
import ComicCanvas from '@/components/ComicCanvas';
import ProjectListModal from '@/components/ProjectListModal';
import { ComicProject } from '@/types/comic';
import { exportComicToHtml, exportComicToPng } from '@/lib/exportUtils';
import confetti from 'canvas-confetti';

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [comic, setComic] = useState<ComicProject | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isProjectListOpen, setIsProjectListOpen] = useState(false);

  // 1. 로그인 인증 확인
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.push('/login');
        }
      } catch (e) {
        router.push('/login');
      }
    }
    checkAuth();
  }, [router]);

  // 1단계: 스토리보드 생성 완료 핸들러
  const handleStoryboardGenerated = (newComic: ComicProject) => {
    setComic(newComic);
    setCurrentStep(2);
    setHasUnsavedChanges(true);
  };

  // 스토리보드 및 만화 업데이트 핸들러
  const handleUpdateComic = (updated: ComicProject) => {
    setComic(updated);
    setHasUnsavedChanges(true);
  };

  // 2단계에서 3단계(만화 캔버스)로 진행 핸들러
  const handleProceedToCanvas = () => {
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 새 만화 만들기
  const handleNewComic = () => {
    if (hasUnsavedChanges && !confirm('저장되지 않은 변경사항이 있습니다. 새로 만드시겠습니까?')) {
      return;
    }
    setComic(null);
    setCurrentStep(1);
    setHasUnsavedChanges(false);
  };

  // Neon DB에 저장 핸들러
  const handleSaveToDb = async () => {
    if (!comic) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/comics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comic),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setHasUnsavedChanges(false);
        confetti({
          particleCount: 50,
          spread: 45,
          origin: { y: 0.2 },
        });
        alert('Neon PostgreSQL 데이터베이스에 성공적으로 저장되었습니다!');
      } else {
        alert(data.error || '저장에 실패했습니다.');
      }
    } catch (e) {
      alert('데이터베이스 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 저장된 프로젝트 선택 핸들러
  const handleSelectSavedComic = (savedComic: ComicProject) => {
    setComic(savedComic);
    setCurrentStep(3); // 바로 만화 캔버스로 이동
    setHasUnsavedChanges(false);
  };

  // HTML 내보내기 핸들러
  const handleExportHtml = () => {
    if (!comic) return;
    exportComicToHtml(comic);
  };

  // PNG 내보내기 핸들러
  const handleExportPng = () => {
    if (!comic) return;
    exportComicToPng(comic);
  };

  // 로딩 중 표시
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-600">인증 상태 확인 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 헤더 */}
      <Header
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        canGoToStep2={!!comic}
        canGoToStep3={!!comic}
        onNewComic={handleNewComic}
        onOpenProjectList={() => setIsProjectListOpen(true)}
        onSaveToDb={handleSaveToDb}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {/* 본문 단계별 뷰 */}
      <main className="flex-1">
        {currentStep === 1 && (
          <Step1Input onStoryboardGenerated={handleStoryboardGenerated} />
        )}

        {currentStep === 2 && comic && (
          <Step2StoryboardEditor
            comic={comic}
            onUpdateComic={handleUpdateComic}
            onProceedToCanvas={handleProceedToCanvas}
            onBackToStep1={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && comic && (
          <ComicCanvas
            comic={comic}
            onUpdateComic={handleUpdateComic}
            onExportHtml={handleExportHtml}
            onExportPng={handleExportPng}
          />
        )}
      </main>

      {/* 보관함 모달 */}
      <ProjectListModal
        isOpen={isProjectListOpen}
        onClose={() => setIsProjectListOpen(false)}
        onSelectComic={handleSelectSavedComic}
      />
    </div>
  );
}
