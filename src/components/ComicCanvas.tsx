'use client';

import React, { useRef, useState } from 'react';
import { ComicProject, ComicPanel } from '@/types/comic';
import { 
  Sparkles, RefreshCw, Edit2, Check, Download, 
  Share2, ZoomIn, ZoomOut, Maximize2, ShieldCheck, 
  HelpCircle, BookOpen, Quote
} from 'lucide-react';

interface ComicCanvasProps {
  comic: ComicProject;
  onUpdateComic: (updated: ComicProject) => void;
  onExportHtml: () => void;
  onExportPng: () => void;
}

export default function ComicCanvas({
  comic,
  onUpdateComic,
  onExportHtml,
  onExportPng,
}: ComicCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState<number | null>(null);

  // 텍스트 인라인 수정 도우미
  const handleTextChange = (fieldPath: string, newValue: string) => {
    const parts = fieldPath.split('.');
    const updated = JSON.parse(JSON.stringify(comic));

    let cur: any = updated;
    for (let i = 0; i < parts.length - 1; i++) {
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = newValue;
    onUpdateComic(updated);
  };

  // 개별 패널 이미지 재생성
  const handleRegeneratePanelImage = async (panelIdx: number, prompt: string) => {
    setIsRegeneratingImage(panelIdx);
    try {
      const res = await fetch('/api/generate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, panelNumber: panelIdx + 1 }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        const updatedPanels = [...comic.panels];
        updatedPanels[panelIdx] = {
          ...updatedPanels[panelIdx],
          imageUrl: data.imageUrl,
        };
        onUpdateComic({ ...comic, panels: updatedPanels });
      }
    } catch (e) {
      console.error('Failed to regenerate image', e);
    } finally {
      setIsRegeneratingImage(null);
    }
  };

  return (
    <div className="max-w-[1300px] mx-auto py-6 px-3 sm:px-6">
      {/* 3단계 조작 툴바 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4 sticky top-16 z-30 no-print">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            [3단계] 최종 9컷 만화 캔버스
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">
            * 텍스트를 직접 클릭하여 바로 수정할 수 있습니다.
          </p>
        </div>

        {/* 줌 및 편집 모드 컨트롤 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditable(!isEditable)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              isEditable
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-slate-100 text-slate-600'
            }`}
            title="텍스트 직접 클릭 수정 모드"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditable ? '텍스트 수정 켜짐' : '텍스트 수정 꺼짐'}</span>
          </button>

          {/* 줌 조절 */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => setZoomLevel(Math.max(60, zoomLevel - 10))}
              className="p-1 hover:bg-white rounded text-slate-600 transition-colors"
              title="축소"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-semibold px-2 text-slate-600">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(130, zoomLevel + 10))}
              className="p-1 hover:bg-white rounded text-slate-600 transition-colors"
              title="확대"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* 내보내기 버튼 */}
          <button
            onClick={onExportHtml}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5"
            title="단독 실행 가능한 HTML 파일 다운로드"
          >
            <Download className="w-4 h-4" />
            <span>HTML 다운로드 (내보내기)</span>
          </button>

          <button
            onClick={onExportPng}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            title="고해상도 이미지 다운로드"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PNG 이미지</span>
          </button>
        </div>
      </div>

      {/* 만화 캔버스 뷰포트 (줌 지원) */}
      <div className="overflow-x-auto pb-12 flex justify-center">
        <div
          ref={canvasRef}
          id="comic-export-root"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
            width: '1180px',
          }}
          className="bg-white border-2 border-slate-900 shadow-2xl p-6 sm:p-8 rounded-none text-slate-900 font-sans comic-export-container select-text"
        >
          {/* =========================================================================
              [상단 메인 타이틀 배너]
              - 좌측 인물 캐릭터 & 말풍선
              - 중앙 볼드 제목 & 부제 & 출처
              - 우측 보조 캐릭터 & 말풍선
             ========================================================================= */}
          <div className="border-b-2 border-slate-900 pb-5 mb-5 grid grid-cols-12 gap-4 items-center">
            {/* 좌측 캐릭터 & 질문 */}
            <div className="col-span-3 flex items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-slate-900 overflow-hidden shrink-0 flex items-center justify-center relative shadow-xs">
                <span className="text-2xl">🙋‍♂️</span>
              </div>
              <div className="speech-bubble speech-bubble-tail-left p-2.5 text-xs font-bold leading-snug text-slate-800 max-w-[210px]">
                <p
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleTextChange(
                      'headerDialogue.leftCharacter.dialogue',
                      e.currentTarget.innerText
                    )
                  }
                  className="outline-none focus:bg-amber-50 rounded"
                >
                  {comic.headerDialogue.leftCharacter.dialogue}
                </p>
              </div>
            </div>

            {/* 중앙 타이틀 & 부제 */}
            <div className="col-span-6 text-center">
              <h1
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange('title', e.currentTarget.innerText)}
                className="text-4xl font-black text-slate-950 tracking-tight leading-tight outline-none focus:bg-blue-50/50 rounded inline-block"
                style={{ fontFamily: "'Do Hyeon', 'Noto Sans KR', sans-serif" }}
              >
                {comic.title}
              </h1>

              <div
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange('subtitle', e.currentTarget.innerText)}
                className="text-sm font-bold text-slate-600 mt-1 outline-none focus:bg-blue-50/50 rounded inline-block"
              >
                {comic.subtitle}
              </div>

              {/* 출처 & 글쓴이 */}
              <div className="mt-2 text-[11px] text-slate-400 font-medium">
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextChange('sourceNote', e.currentTarget.innerText)}
                  className="outline-none focus:bg-slate-100 px-1 rounded"
                >
                  {comic.sourceNote || '글·구성: 교육 인포그래픽 만화 연구팀'}
                </span>
              </div>
            </div>

            {/* 우측 캐릭터 & 답변 */}
            <div className="col-span-3 flex items-center justify-end gap-2">
              <div className="speech-bubble speech-bubble-tail-right p-2.5 text-xs font-bold leading-snug text-blue-900 bg-blue-50 border-blue-900 max-w-[200px] text-right">
                <p
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleTextChange(
                      'headerDialogue.rightCharacter.dialogue',
                      e.currentTarget.innerText
                    )
                  }
                  className="outline-none focus:bg-blue-100/50 rounded"
                >
                  {comic.headerDialogue.rightCharacter.dialogue}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-100 border-2 border-slate-900 overflow-hidden shrink-0 flex items-center justify-center relative shadow-xs">
                <span className="text-2xl">⛪</span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              [3×3 9개 패널 그리드]
             ========================================================================= */}
          <div className="grid grid-cols-3 gap-4">
            {comic.panels.map((panel, idx) => (
              <PanelCard
                key={panel.panelNumber || idx}
                panel={panel}
                panelIdx={idx}
                isEditable={isEditable}
                onTextChange={handleTextChange}
                onRegenerateImage={handleRegeneratePanelImage}
                isRegenerating={isRegeneratingImage === idx}
              />
            ))}
          </div>

          {/* 하단 푸터 표기 */}
          <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <span>현스 9컷 교육용 인포그래픽 만화 &bull; 한 장으로 읽는 미니 교과서</span>
            <span>제작일: {new Date().toLocaleDateString('ko-KR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------------
// 개별 패널 컴포넌트 (1번~9번)
// ----------------------------------------------------------------------------------
interface PanelCardProps {
  panel: ComicPanel;
  panelIdx: number;
  isEditable: boolean;
  onTextChange: (path: string, val: string) => void;
  onRegenerateImage: (idx: number, prompt: string) => void;
  isRegenerating: boolean;
}

function PanelCard({
  panel,
  panelIdx,
  isEditable,
  onTextChange,
  onRegenerateImage,
  isRegenerating,
}: PanelCardProps) {
  const numberBadges = ['❶', '❷', '❸', '❹', '❺', '❻', '❼', '❽', '❾'];
  const badge = numberBadges[panel.panelNumber - 1] || `[${panel.panelNumber}]`;

  return (
    <div className="border-2 border-slate-900 rounded-xl overflow-hidden bg-white flex flex-col justify-between shadow-xs relative">
      {/* 1. 패널 상단 번호 뱃지 & 패널 제목 */}
      <div className="bg-slate-900 text-white p-2.5 flex items-center gap-2">
        <span className="text-base font-black text-amber-300 shrink-0">{badge}</span>
        <h2
          contentEditable={isEditable}
          suppressContentEditableWarning
          onBlur={(e) =>
            onTextChange(`panels.${panelIdx}.title`, e.currentTarget.innerText)
          }
          className="text-xs sm:text-[13px] font-black tracking-tight leading-snug outline-none focus:bg-slate-800 rounded px-1 flex-1 truncate"
        >
          {panel.title}
        </h2>
      </div>

      {/* 2. 패널 본문 영역 */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5 bg-gradient-to-b from-white to-slate-50/40">
        {/* 핵심 메시지 1~2줄 */}
        <p
          contentEditable={isEditable}
          suppressContentEditableWarning
          onBlur={(e) =>
            onTextChange(`panels.${panelIdx}.keyMessage`, e.currentTarget.innerText)
          }
          className="text-xs font-semibold text-slate-800 leading-relaxed outline-none focus:bg-blue-50/60 rounded px-1"
        >
          {panel.keyMessage}
        </p>

        {/* 3. 패널 특화 인포그래픽 도식 / 비주얼 요소 */}
        <div className="my-1">
          {renderDiagramContent(panel, panelIdx, isEditable, onTextChange)}
        </div>

        {/* 4. 말풍선 컴포넌트 */}
        {panel.speechBubbles && panel.speechBubbles.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {panel.speechBubbles.map((bubble, bIdx) => (
              <div
                key={bubble.id || bIdx}
                className="speech-bubble speech-bubble-tail-bottom p-2 bg-amber-50/80 border-slate-800 text-[11px] font-bold text-slate-900 leading-snug"
              >
                <div
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onTextChange(
                      `panels.${panelIdx}.speechBubbles.${bIdx}.text`,
                      e.currentTarget.innerText
                    )
                  }
                  className="outline-none focus:bg-white rounded px-0.5"
                >
                  {bubble.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. 일러스트 이미지 (URL이 있거나 생성 가능한 경우) */}
        {panel.imageUrl && (
          <div className="relative rounded-lg overflow-hidden border border-slate-300 mt-1 max-h-36">
            <img
              src={panel.imageUrl}
              alt={panel.title}
              className="w-full h-32 object-cover"
            />
            {isEditable && (
              <button
                onClick={() =>
                  onRegenerateImage(panelIdx, panel.sceneDescription || panel.title)
                }
                disabled={isRegenerating}
                className="absolute top-1 right-1 p-1 bg-white/90 rounded-md text-[10px] text-slate-700 shadow hover:bg-white transition-all flex items-center gap-1"
                title="일러스트 새로고침"
              >
                <RefreshCw
                  className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : ''}`}
                />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 6. 독자가 반드시 기억해야 할 한 문장 (패널 하단 띠) */}
      <div className="bg-slate-100 border-t-2 border-slate-900 p-2 text-center">
        <p
          contentEditable={isEditable}
          suppressContentEditableWarning
          onBlur={(e) =>
            onTextChange(`panels.${panelIdx}.mustRemember`, e.currentTarget.innerText)
          }
          className="text-[11px] font-black text-slate-900 leading-snug outline-none focus:bg-amber-100 rounded px-1 inline-block"
        >
          &quot;{panel.mustRemember}&quot;
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------------
// 패널별 맞춤형 인포그래픽 도식 렌더러
// ----------------------------------------------------------------------------------
function renderDiagramContent(
  panel: ComicPanel,
  panelIdx: number,
  isEditable: boolean,
  onTextChange: (path: string, val: string) => void
) {
  const diagram = panel.diagram;
  if (!diagram || diagram.type === 'none') {
    return (
      <div className="p-2.5 rounded-lg bg-slate-100/80 border border-slate-200 text-[11px] text-slate-600 italic text-center">
        {panel.sceneDescription}
      </div>
    );
  }

  // 1. 고문서 두루마리 (패널 1: 사도신경 등)
  if (diagram.type === 'scroll') {
    return (
      <div className="parchment-scroll p-3 text-slate-900 relative">
        <div className="text-[11px] font-black text-amber-900 text-center uppercase tracking-widest border-b border-amber-300 pb-1 mb-1.5 flex items-center justify-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-amber-800" />
          <span>{diagram.title || '사도신경'}</span>
        </div>
        <p
          contentEditable={isEditable}
          suppressContentEditableWarning
          onBlur={(e) =>
            onTextChange(
              `panels.${panelIdx}.diagram.highlightText`,
              e.currentTarget.innerText
            )
          }
          className="text-[11px] font-serif leading-relaxed text-amber-950 text-justify outline-none focus:bg-amber-100/50 rounded"
        >
          {diagram.highlightText ||
            '나는 전능하신 아버지 하나님을 믿으며, 그의 외아들 예수 그리스도를 믿습니다.'}
        </p>
      </div>
    );
  }

  // 2. 네트워크 / 원형 지체 다이어그램 (패널 2 등)
  if (diagram.type === 'network') {
    return (
      <div className="p-3 bg-gradient-to-r from-blue-50/60 via-purple-50/60 to-emerald-50/60 rounded-xl border border-slate-200">
        <div className="text-center font-black text-xs text-slate-800 mb-2">
          {diagram.title || '한 몸, 많은 지체'}
        </div>
        <div className="flex flex-wrap justify-center gap-1.5 mb-2">
          {(diagram.items || [
            { label: '장로교', color: 'bg-blue-600 text-white' },
            { label: '감리교', color: 'bg-emerald-600 text-white' },
            { label: '침례교', color: 'bg-amber-600 text-white' },
            { label: '루터교', color: 'bg-rose-600 text-white' },
            { label: '성공회', color: 'bg-purple-600 text-white' },
          ]).map((item, i) => (
            <span
              key={i}
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-2xs ${item.color || 'bg-slate-700 text-white'}`}
            >
              {item.label}
            </span>
          ))}
        </div>
        {diagram.highlightText && (
          <p
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) =>
              onTextChange(
                `panels.${panelIdx}.diagram.highlightText`,
                e.currentTarget.innerText
              )
            }
            className="text-[10px] text-center font-bold text-slate-700 outline-none focus:bg-white rounded"
          >
            {diagram.highlightText}
          </p>
        )}
      </div>
    );
  }

  // 3. 다중 비교 카드 (패널 3 종교개혁자 3인, 패널 4 교파별 강조점 등)
  if (diagram.type === 'cards_compare') {
    const items = diagram.items || [];
    return (
      <div className="space-y-1.5">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 text-center">
          {items.map((item, i) => (
            <div
              key={i}
              className={`p-1.5 rounded-lg border text-[10px] flex flex-col justify-between ${
                item.color || 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="font-black text-slate-900 block truncate">
                {item.label}
              </span>
              <span className="text-[9px] text-slate-600 whitespace-pre-line leading-tight mt-0.5">
                {item.description}
              </span>
            </div>
          ))}
        </div>
        {diagram.highlightText && (
          <div
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) =>
              onTextChange(
                `panels.${panelIdx}.diagram.highlightText`,
                e.currentTarget.innerText
              )
            }
            className="p-1.5 rounded-md bg-amber-100/90 text-amber-950 font-black text-[10px] text-center outline-none focus:bg-amber-200"
          >
            {diagram.highlightText}
          </div>
        )}
      </div>
    );
  }

  // 4. 불릿 리스트 (패널 5 감리교의 핵심 등)
  if (diagram.type === 'bullet_list') {
    return (
      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div className="font-extrabold text-[11px] text-blue-900 border-b border-slate-200 pb-1 mb-1.5 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>{diagram.title || '핵심 원리'}</span>
        </div>
        <ul className="space-y-1">
          {(diagram.items || []).map((it, i) => (
            <li
              key={i}
              className="text-[10px] text-slate-700 flex items-start gap-1 font-medium"
            >
              <span className="text-blue-500 font-bold">•</span>
              <span>{it.label}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // 5. 2열 대조 표 (패널 6 장로교 vs 감리교, 패널 7 정통 교파 vs 이단)
  if (diagram.type === 'table_compare') {
    const headers = diagram.tableHeaders || ['장로교', '감리교'];
    const rows = diagram.tableRows || [];
    const isOrthodoxVsCult = headers[0]?.includes('정통') || headers[1]?.includes('이단');

    return (
      <div className="rounded-lg overflow-hidden border border-slate-300 text-[10px]">
        {/* 표 헤더 */}
        <div className="grid grid-cols-2 text-center font-black">
          <div
            className={`p-1.5 ${
              isOrthodoxVsCult ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
            }`}
          >
            {headers[0]}
          </div>
          <div
            className={`p-1.5 ${
              isOrthodoxVsCult ? 'bg-rose-600 text-white' : 'bg-teal-600 text-white'
            }`}
          >
            {headers[1]}
          </div>
        </div>

        {/* 표 행들 */}
        <div className="divide-y divide-slate-200 bg-white">
          {rows.map((row, rIdx) => (
            <div key={rIdx} className="grid grid-cols-2 text-[10px] text-slate-800">
              <div
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onTextChange(
                    `panels.${panelIdx}.diagram.tableRows.${rIdx}.col1`,
                    e.currentTarget.innerText
                  )
                }
                className="p-1 px-1.5 border-r border-slate-200 outline-none focus:bg-slate-50 font-medium"
              >
                {row.col1}
              </div>
              <div
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onTextChange(
                    `panels.${panelIdx}.diagram.tableRows.${rIdx}.col2`,
                    e.currentTarget.innerText
                  )
                }
                className="p-1 px-1.5 outline-none focus:bg-slate-50 font-medium"
              >
                {row.col2}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. 강조 인용구 (패널 8 정원 비유, 패널 9 최종 결론)
  if (diagram.type === 'quote_highlight') {
    return (
      <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-center">
        <Quote className="w-4 h-4 text-amber-600 mx-auto mb-1 opacity-70" />
        <p
          contentEditable={isEditable}
          suppressContentEditableWarning
          onBlur={(e) =>
            onTextChange(`panels.${panelIdx}.diagram.quoteText`, e.currentTarget.innerText)
          }
          className="text-xs font-black text-amber-950 leading-snug outline-none focus:bg-white/80 rounded"
        >
          {diagram.quoteText}
        </p>
        {diagram.highlightText && (
          <p
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) =>
              onTextChange(
                `panels.${panelIdx}.diagram.highlightText`,
                e.currentTarget.innerText
              )
            }
            className="text-[10px] font-bold text-amber-800 mt-1 outline-none focus:bg-white/80 rounded"
          >
            {diagram.highlightText}
          </p>
        )}
      </div>
    );
  }

  return null;
}
