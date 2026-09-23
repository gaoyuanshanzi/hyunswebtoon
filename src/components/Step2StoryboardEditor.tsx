'use client';

import React, { useState } from 'react';
import { ComicProject, ComicPanel } from '@/types/comic';
import { 
  Sparkles, ArrowRight, ArrowLeft, Edit3, MessageSquare, 
  Image as ImageIcon, CheckSquare, Layers, Quote, Table, HelpCircle 
} from 'lucide-react';

interface Step2StoryboardEditorProps {
  comic: ComicProject;
  onUpdateComic: (updated: ComicProject) => void;
  onProceedToCanvas: () => void;
  onBackToStep1: () => void;
}

export default function Step2StoryboardEditor({
  comic,
  onUpdateComic,
  onProceedToCanvas,
  onBackToStep1,
}: Step2StoryboardEditorProps) {
  const [activePanelIdx, setActivePanelIdx] = useState<number>(0);
  const [isGeneratingComic, setIsGeneratingComic] = useState(false);

  // 패널 필드 수정 핸들러
  const handleUpdatePanel = (idx: number, field: keyof ComicPanel, value: any) => {
    const updatedPanels = [...comic.panels];
    updatedPanels[idx] = {
      ...updatedPanels[idx],
      [field]: value,
    };
    onUpdateComic({
      ...comic,
      panels: updatedPanels,
    });
  };

  // 말풍선 대사 수정 핸들러
  const handleUpdateBubble = (panelIdx: number, bubbleIdx: number, text: string) => {
    const updatedPanels = [...comic.panels];
    const updatedBubbles = [...updatedPanels[panelIdx].speechBubbles];
    updatedBubbles[bubbleIdx] = {
      ...updatedBubbles[bubbleIdx],
      text,
    };
    updatedPanels[panelIdx].speechBubbles = updatedBubbles;
    onUpdateComic({
      ...comic,
      panels: updatedPanels,
    });
  };

  const handleProceed = () => {
    setIsGeneratingComic(true);
    // 진행 시 캔버스로 매끄럽게 전환
    setTimeout(() => {
      setIsGeneratingComic(false);
      onProceedToCanvas();
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* 2단계 상단 안내 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            [2단계] 스토리보드 검토 및 수정
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            생성된 9칸 기획안의 텍스트를 검토하고 수정하세요
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            원하는 텍스트를 자유롭게 다듬은 후 [3×3 교육용 만화 생성하기]를 누르면 실시간 만화가 조립됩니다.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onBackToStep1}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            주제 다시 입력
          </button>
          <button
            onClick={handleProceed}
            disabled={isGeneratingComic}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-extrabold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
          >
            {isGeneratingComic ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>3×3 교육용 만화 생성하기 (진행)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 전체 메타 정보 편집 바 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs mb-8 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          전체 타이틀 및 배너 설정
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">메인 제목</label>
            <input
              type="text"
              value={comic.title}
              onChange={(e) => onUpdateComic({ ...comic, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">부제 (슬로건)</label>
            <input
              type="text"
              value={comic.subtitle}
              onChange={(e) => onUpdateComic({ ...comic, subtitle: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">출처 / 작성자 표기</label>
            <input
              type="text"
              value={comic.sourceNote || ''}
              onChange={(e) => onUpdateComic({ ...comic, sourceNote: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* 상단 양옆 캐릭터 말풍선 대사 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              상단 좌측 캐릭터 질문 말풍선
            </label>
            <input
              type="text"
              value={comic.headerDialogue.leftCharacter.dialogue}
              onChange={(e) =>
                onUpdateComic({
                  ...comic,
                  headerDialogue: {
                    ...comic.headerDialogue,
                    leftCharacter: { dialogue: e.target.value },
                  },
                })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              상단 우측 답변 말풍선
            </label>
            <input
              type="text"
              value={comic.headerDialogue.rightCharacter.dialogue}
              onChange={(e) =>
                onUpdateComic({
                  ...comic,
                  headerDialogue: {
                    ...comic.headerDialogue,
                    rightCharacter: { dialogue: e.target.value },
                  },
                })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 9개 패널 퀵 네비게이션 탭 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {comic.panels.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setActivePanelIdx(idx)}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activePanelIdx === idx
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                activePanelIdx === idx ? 'bg-white text-blue-600' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {p.panelNumber}
            </span>
            <span className="truncate max-w-[120px]">{p.title}</span>
          </button>
        ))}
      </div>

      {/* 9개 패널 카드 리스트 (모든 패널을 직관적으로 확인 및 수정) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comic.panels.map((panel, idx) => {
          const isSelected = activePanelIdx === idx;

          return (
            <div
              key={idx}
              onClick={() => setActivePanelIdx(idx)}
              className={`rounded-2xl border transition-all duration-200 flex flex-col bg-white overflow-hidden ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* 패널 헤더 */}
              <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">
                    {panel.panelNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    패널 {panel.panelNumber} / 9
                  </span>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {panel.hasDiagram ? `도식: ${panel.diagram?.type || '있음'}` : '일러스트'}
                </span>
              </div>

              {/* 패널 편집 바디 */}
              <div className="p-5 space-y-4 flex-1">
                {/* 1. 패널 제목 */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Edit3 className="w-3 h-3 text-blue-500" />
                    1. 패널 제목
                  </label>
                  <input
                    type="text"
                    value={panel.title}
                    onChange={(e) => handleUpdatePanel(idx, 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* 2. 핵심 메시지 */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <CheckSquare className="w-3 h-3 text-emerald-500" />
                    2. 핵심 메시지
                  </label>
                  <textarea
                    rows={2}
                    value={panel.keyMessage}
                    onChange={(e) => handleUpdatePanel(idx, 'keyMessage', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {/* 3. 그림으로 보여줄 장면 (Prompt) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-indigo-500" />
                    3. 그림으로 보여줄 장면
                  </label>
                  <textarea
                    rows={2}
                    value={panel.sceneDescription}
                    onChange={(e) => handleUpdatePanel(idx, 'sceneDescription', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 focus:bg-white focus:outline-none focus:border-blue-500 resize-none font-sans"
                  />
                </div>

                {/* 4. 말풍선 대사 */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-amber-500" />
                    4. 말풍선 대사
                  </label>
                  {panel.speechBubbles.map((bubble, bIdx) => (
                    <input
                      key={bubble.id || bIdx}
                      type="text"
                      value={bubble.text}
                      onChange={(e) => handleUpdateBubble(idx, bIdx, e.target.value)}
                      placeholder="등장인물 말풍선 대사..."
                      className="w-full px-3 py-2 bg-amber-50/50 border border-amber-200/80 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500 mb-1"
                    />
                  ))}
                </div>

                {/* 5. 표나 도식 (데이터 간략 정보) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Table className="w-3 h-3 text-purple-500" />
                    5. 표/도식 적용 내용
                  </label>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                    <div className="font-semibold text-slate-800">
                      유형: {panel.diagram?.type || '기본'}
                    </div>
                    {panel.diagram?.highlightText && (
                      <p className="text-[11px] text-slate-500 truncate">
                        강조: {panel.diagram.highlightText}
                      </p>
                    )}
                  </div>
                </div>

                {/* 6. 독자가 반드시 기억해야 할 한 문장 */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Quote className="w-3 h-3 text-rose-500" />
                    6. 기억해야 할 한 문장
                  </label>
                  <input
                    type="text"
                    value={panel.mustRemember}
                    onChange={(e) => handleUpdatePanel(idx, 'mustRemember', e.target.value)}
                    className="w-full px-3 py-2 bg-rose-50/40 border border-rose-200/80 rounded-lg text-xs font-semibold text-rose-900 focus:bg-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 하단 진행 버튼 바 */}
      <div className="mt-10 p-6 bg-white rounded-3xl border border-slate-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-black text-slate-900 text-base">스토리보드 검토가 완료되었나요?</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            진행 버튼을 누르면 3×3 인포그래픽 만화가 생성되며, 화면에서 모든 텍스트를 바로 클릭하여 추가 수정할 수 있습니다.
          </p>
        </div>

        <button
          onClick={handleProceed}
          disabled={isGeneratingComic}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 shrink-0"
        >
          {isGeneratingComic ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          <span>3단계: 3×3 교육용 만화 생성하기 (진행)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
