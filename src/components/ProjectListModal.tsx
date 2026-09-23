'use client';

import React, { useEffect, useState } from 'react';
import { X, Trash2, FolderOpen, Calendar, Clock, ArrowRight } from 'lucide-react';
import { ComicProject } from '@/types/comic';

interface ProjectListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComic: (comic: ComicProject) => void;
}

export default function ProjectListModal({
  isOpen,
  onClose,
  onSelectComic,
}: ProjectListModalProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/comics');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]);
      }
    } catch (e: any) {
      setError('프로젝트 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  const handleSelect = async (id: string) => {
    try {
      const res = await fetch(`/api/comics?id=${id}`);
      const data = await res.json();
      if (data && data.id) {
        onSelectComic(data);
        onClose();
      }
    } catch (e) {
      alert('프로젝트를 불러오지 못했습니다.');
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('이 만화 프로젝트를 삭제하시겠습니까?')) return;

    try {
      await fetch(`/api/comics?id=${id}`, { method: 'DELETE' });
      setProjects(projects.filter((p) => p.id !== id));
    } catch (e) {
      alert('삭제 실패');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-scale-up">
        {/* 모달 헤더 */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">내 만화 보관함 (Neon DB)</h3>
              <p className="text-xs text-slate-500">저장된 9컷 교육 만화 목록</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 모달 바디 */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <span className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full inline-block animate-spin mb-2" />
              <p>저장된 만화 목록을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-rose-500 text-xs font-semibold">{error}</div>
          ) : projects.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <p className="font-semibold text-slate-600 mb-1">저장된 프로젝트가 없습니다.</p>
              <p>스토리보드를 기획하고 상단 [DB 저장]을 누르면 여기에 보관됩니다.</p>
            </div>
          ) : (
            projects.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                      대상: {item.audience}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.updated_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="프로젝트 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="p-2 text-blue-600">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 모달 푸터 */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
