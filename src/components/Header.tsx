'use client';

import React from 'react';
import { BookOpen, FolderOpen, Save, PlusCircle, LogOut, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  currentStep: 1 | 2 | 3;
  setCurrentStep: (step: 1 | 2 | 3) => void;
  canGoToStep2: boolean;
  canGoToStep3: boolean;
  onNewComic: () => void;
  onOpenProjectList: () => void;
  onSaveToDb: () => void;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
}

export default function Header({
  currentStep,
  setCurrentStep,
  canGoToStep2,
  canGoToStep3,
  onNewComic,
  onOpenProjectList,
  onSaveToDb,
  isSaving = false,
  hasUnsavedChanges = false,
}: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* 로고 & 브랜드 */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNewComic}>
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 text-lg tracking-tight">현스 9컷 교육만화</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                PRO Studio
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">3×3 인포그래픽 만화 제작기</p>
          </div>
        </div>

        {/* 1, 2, 3 단계 네비게이션 */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setCurrentStep(1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentStep === 1
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">1</span>
            주제·대상 입력
          </button>

          <button
            onClick={() => canGoToStep2 && setCurrentStep(2)}
            disabled={!canGoToStep2}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentStep === 2
                ? 'bg-white text-blue-600 shadow-sm'
                : canGoToStep2
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 cursor-not-allowed opacity-50'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">2</span>
            스토리보드 수정
          </button>

          <button
            onClick={() => canGoToStep3 && setCurrentStep(3)}
            disabled={!canGoToStep3}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentStep === 3
                ? 'bg-white text-blue-600 shadow-sm'
                : canGoToStep3
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 cursor-not-allowed opacity-50'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">3</span>
            3×3 만화 캔버스 & 편집
          </button>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex items-center gap-2">
          {/* 새 만화 */}
          <button
            onClick={onNewComic}
            className="p-2 sm:px-3 sm:py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200"
            title="새 만화 만들기"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">새로 만들기</span>
          </button>

          {/* 저장된 목록 */}
          <button
            onClick={onOpenProjectList}
            className="p-2 sm:px-3 sm:py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200"
            title="저장된 프로젝트 목록"
          >
            <FolderOpen className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">내 보관함</span>
          </button>

          {/* DB 저장 */}
          <button
            onClick={onSaveToDb}
            disabled={isSaving || !canGoToStep2}
            className="px-3.5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-40"
            title="Neon DB에 저장"
          >
            {isSaving ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : hasUnsavedChanges ? (
              <Save className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>{isSaving ? '저장 중...' : 'DB 저장'}</span>
          </button>

          {/* 로그아웃 */}
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="관리자 로그아웃"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
