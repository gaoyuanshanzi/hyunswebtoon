'use client';

import React, { useRef, useState } from 'react';
import { ComicProject, ComicPanel, DiagramType, DiagramData } from '@/types/comic';
import ComicCharacter, { getCharacterPoseForPanel, CharacterGender } from './ComicCharacter';
import { 
  Sparkles, RefreshCw, Edit2, Download, 
  Share2, ZoomIn, ZoomOut, ShieldCheck, 
  BookOpen, Quote, Smile, Plus, Trash2, 
  ChevronDown, UserCheck, LayoutGrid, Check, X
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

  // 전역 캐릭터 성별 (기본: male)
  const globalGender: CharacterGender = comic.characterGender || 'male';

  const handleToggleGlobalGender = () => {
    const nextGender: CharacterGender = globalGender === 'male' ? 'female' : 'male';
    const updated = {
      ...comic,
      characterGender: nextGender,
      // 모든 패널의 개별 성별도 함께 일괄 적용
      panels: comic.panels.map((p) => ({ ...p, characterGender: nextGender })),
    };
    onUpdateComic(updated);
  };

  // 개별 패널 성별 토글
  const handleTogglePanelGender = (panelIdx: number) => {
    const current = comic.panels[panelIdx].characterGender || globalGender;
    const next: CharacterGender = current === 'male' ? 'female' : 'male';
    const updatedPanels = [...comic.panels];
    updatedPanels[panelIdx] = {
      ...updatedPanels[panelIdx],
      characterGender: next,
    };
    onUpdateComic({ ...comic, panels: updatedPanels });
  };

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

  // 도식 변경 핸들러
  const handleChangeDiagramType = (panelIdx: number, newType: DiagramType) => {
    const updatedPanels = [...comic.panels];
    const defaultData = getDefaultDiagramData(newType, comic.panels[panelIdx].title);
    
    updatedPanels[panelIdx] = {
      ...updatedPanels[panelIdx],
      hasDiagram: newType !== 'none',
      diagram: defaultData,
    };
    onUpdateComic({ ...comic, panels: updatedPanels });
  };

  // 도식 삭제 핸들러
  const handleDeleteDiagram = (panelIdx: number) => {
    const updatedPanels = [...comic.panels];
    updatedPanels[panelIdx] = {
      ...updatedPanels[panelIdx],
      hasDiagram: false,
      diagram: { type: 'none' },
    };
    onUpdateComic({ ...comic, panels: updatedPanels });
  };

  // 도식 행/항목 추가 핸들러
  const handleAddDiagramItem = (panelIdx: number) => {
    const updatedPanels = [...comic.panels];
    const diagram = updatedPanels[panelIdx].diagram;
    if (!diagram) return;

    if (diagram.type === 'table_compare') {
      const rows = diagram.tableRows || [];
      diagram.tableRows = [...rows, { col1: '새 항목 내용 A', col2: '새 항목 내용 B' }];
    } else if (diagram.type === 'cards_compare') {
      const items = diagram.items || [];
      diagram.items = [...items, { label: `항목 ${items.length + 1}`, description: '설명을 입력하세요' }];
    } else if (diagram.type === 'bullet_list') {
      const items = diagram.items || [];
      diagram.items = [...items, { label: '새로운 핵심 원리 항목' }];
    } else if (diagram.type === 'network') {
      const items = diagram.items || [];
      diagram.items = [...items, { label: '새 키워드', color: 'bg-indigo-600 text-white' }];
    }

    onUpdateComic({ ...comic, panels: updatedPanels });
  };

  // 도식 행/항목 삭제 핸들러
  const handleDeleteDiagramItem = (panelIdx: number, itemIdx?: number) => {
    const updatedPanels = [...comic.panels];
    const diagram = updatedPanels[panelIdx].diagram;
    if (!diagram) return;

    if (diagram.type === 'table_compare' && diagram.tableRows && diagram.tableRows.length > 1) {
      const idxToDelete = itemIdx !== undefined ? itemIdx : diagram.tableRows.length - 1;
      diagram.tableRows = diagram.tableRows.filter((_, i) => i !== idxToDelete);
    } else if (diagram.items && diagram.items.length > 1) {
      const idxToDelete = itemIdx !== undefined ? itemIdx : diagram.items.length - 1;
      diagram.items = diagram.items.filter((_, i) => i !== idxToDelete);
    }

    onUpdateComic({ ...comic, panels: updatedPanels });
  };

  return (
    <div className="max-w-[1300px] mx-auto py-6 px-3 sm:px-6">
      {/* 3단계 조작 툴바 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-3 sticky top-16 z-30 no-print">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            [3단계] 최종 9컷 만화 캔버스
          </div>

          {/* 남성 / 여성 캐릭터 전역 전환 버튼 */}
          <button
            onClick={handleToggleGlobalGender}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-all flex items-center gap-1.5 shadow-2xs"
            title="캐릭터 성별 전체 변경"
          >
            <span className="text-base">{globalGender === 'female' ? '👧' : '👦'}</span>
            <span>캐릭터: <strong>{globalGender === 'female' ? '여성(소녀)' : '남성(소년)'}</strong></span>
            <span className="text-[10px] text-blue-600 bg-blue-100/70 px-1.5 py-0.5 rounded">클릭 시 전환</span>
          </button>

          <button
            onClick={() => setIsEditable(!isEditable)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isEditable
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="텍스트 직접 클릭 수정 모드"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditable ? '인라인 편집 켜짐' : '인라인 편집 꺼짐'}</span>
          </button>
        </div>

        {/* 줌 및 내보내기 버튼 */}
        <div className="flex items-center gap-2">
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

          {/* HTML 다운로드 */}
          <button
            onClick={onExportHtml}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5"
            title="단독 실행 가능한 HTML 파일 다운로드"
          >
            <Download className="w-4 h-4" />
            <span>HTML 다운로드 (내보내기)</span>
          </button>

          {/* PNG 다운로드 */}
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
            width: '1200px',
          }}
          className="bg-white border-3 border-slate-900 shadow-2xl p-6 sm:p-8 rounded-none text-slate-900 font-sans comic-export-container select-text"
        >
          {/* =========================================================================
              [상단 메인 타이틀 배너]
             ========================================================================= */}
          <div className="border-b-3 border-slate-900 pb-5 mb-5 grid grid-cols-12 gap-3 items-center">
            {/* 좌측 캐릭터 & 질문 */}
            <div className="col-span-3 flex items-center gap-2">
              <div 
                onClick={handleToggleGlobalGender}
                className="w-18 h-18 rounded-2xl bg-gradient-to-b from-blue-50 to-slate-100 border-2 border-slate-900 overflow-hidden shrink-0 flex items-center justify-center relative shadow-xs p-1 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                title="클릭하여 남/여 캐릭터 전환"
              >
                <ComicCharacter pose="curious" gender={globalGender} size={70} />
              </div>
              <div className="speech-bubble speech-bubble-tail-left p-2.5 text-xs font-bold leading-snug text-slate-800 max-w-[200px]">
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
                className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight outline-none focus:bg-blue-50/50 rounded inline-block"
                style={{ fontFamily: "'Do Hyeon', 'Noto Sans KR', sans-serif" }}
              >
                {comic.title}
              </h1>

              <div
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange('subtitle', e.currentTarget.innerText)}
                className="text-sm sm:text-base font-bold text-slate-600 mt-1 outline-none focus:bg-blue-50/50 rounded inline-block"
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
              <div className="speech-bubble speech-bubble-tail-right p-2.5 text-xs font-bold leading-snug text-blue-900 bg-blue-50/90 border-blue-900 max-w-[200px] text-right">
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
              <div 
                onClick={handleToggleGlobalGender}
                className="w-18 h-18 rounded-2xl bg-gradient-to-b from-blue-50 to-indigo-100 border-2 border-slate-900 overflow-hidden shrink-0 flex items-center justify-center relative shadow-xs p-1 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                title="클릭하여 남/여 캐릭터 전환"
              >
                <ComicCharacter pose="explaining" gender={globalGender} size={70} />
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
                globalGender={globalGender}
                isEditable={isEditable}
                onTextChange={handleTextChange}
                onTogglePanelGender={handleTogglePanelGender}
                onChangeDiagramType={handleChangeDiagramType}
                onDeleteDiagram={handleDeleteDiagram}
                onAddDiagramItem={handleAddDiagramItem}
                onDeleteDiagramItem={handleDeleteDiagramItem}
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
  globalGender: CharacterGender;
  isEditable: boolean;
  onTextChange: (path: string, val: string) => void;
  onTogglePanelGender: (idx: number) => void;
  onChangeDiagramType: (idx: number, type: DiagramType) => void;
  onDeleteDiagram: (idx: number) => void;
  onAddDiagramItem: (idx: number) => void;
  onDeleteDiagramItem: (panelIdx: number, itemIdx?: number) => void;
}

function PanelCard({
  panel,
  panelIdx,
  globalGender,
  isEditable,
  onTextChange,
  onTogglePanelGender,
  onChangeDiagramType,
  onDeleteDiagram,
  onAddDiagramItem,
  onDeleteDiagramItem,
}: PanelCardProps) {
  const numberBadges = ['❶', '❷', '❸', '❹', '❺', '❻', '❼', '❽', '❾'];
  const badge = numberBadges[panel.panelNumber - 1] || `[${panel.panelNumber}]`;

  // 캐릭터 포즈 및 성별 결정
  const characterPose = getCharacterPoseForPanel(panel.panelNumber);
  const panelGender: CharacterGender = panel.characterGender || globalGender;

  const [showDiagramMenu, setShowDiagramMenu] = useState(false);

  const diagramTypes: { type: DiagramType; label: string; icon: string }[] = [
    { type: 'table_compare', label: '2열 대조 비교표', icon: '⚖️' },
    { type: 'cards_compare', label: '다중 비교 카드', icon: '🗂️' },
    { type: 'bullet_list', label: '체크리스트/불릿', icon: '🛡️' },
    { type: 'scroll', label: '두루마리 박스', icon: '📜' },
    { type: 'quote_highlight', label: '인용구 강조 박스', icon: '💬' },
    { type: 'network', label: '키워드 뱃지 모음', icon: '🌐' },
  ];

  return (
    <div className="border-2 border-slate-900 rounded-xl overflow-hidden bg-white flex flex-col justify-between shadow-xs relative">
      {/* 1. 패널 상단 번호 뱃지 & 패널 제목 */}
      <div className="bg-slate-900 text-white p-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
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

        {/* 도식 관리 툴바 드롭다운 버튼 */}
        {isEditable && (
          <div className="relative shrink-0 no-print">
            <button
              onClick={() => setShowDiagramMenu(!showDiagramMenu)}
              className="p-1 px-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-amber-300 flex items-center gap-1 transition-colors"
              title="도형/표 변경 및 관리"
            >
              <span>도형 설정</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showDiagramMenu && (
              <div className="absolute right-0 top-7 w-44 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 z-50 p-1.5 space-y-1 text-xs animate-scale-up">
                <div className="text-[10px] font-extrabold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  도형/표 종류 변경
                </div>
                {diagramTypes.map((dt) => (
                  <button
                    key={dt.type}
                    onClick={() => {
                      onChangeDiagramType(panelIdx, dt.type);
                      setShowDiagramMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                      panel.diagram?.type === dt.type
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>{dt.icon}</span>
                    <span>{dt.label}</span>
                  </button>
                ))}
                <div className="border-t border-slate-100 my-1 pt-1">
                  <button
                    onClick={() => {
                      onDeleteDiagram(panelIdx);
                      setShowDiagramMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>도형 완전히 삭제</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. 패널 본문 영역 */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5 bg-gradient-to-b from-white via-white to-slate-50/50">
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

        {/* 3. 패널 중간 배치 도식 (완전한 객체로 편집, 행 추가/삭제 가능) */}
        <div className="my-1 relative group">
          {renderInteractiveDiagram(
            panel,
            panelIdx,
            isEditable,
            onTextChange,
            onChangeDiagramType,
            onDeleteDiagram,
            onAddDiagramItem,
            onDeleteDiagramItem
          )}
        </div>

        {/* 4. [만화 캐릭터 + 말풍선 결합 영역] */}
        {/* 말풍선 꼬리표가 왼쪽의 캐릭터 입/얼굴을 명확히 가리키도록 speech-bubble-tail-left 적용! */}
        <div className="pt-1.5 border-t border-slate-100 flex items-end gap-2.5">
          {/* 캐릭터 아바타 (클릭 시 남/여 개별 토글 가능) */}
          <div
            onClick={() => onTogglePanelGender(panelIdx)}
            className="relative group shrink-0 cursor-pointer"
            title="클릭하여 이 컷의 캐릭터 남/여 전환"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-50 border border-slate-300 overflow-hidden flex items-center justify-center p-0.5 shadow-2xs group-hover:border-blue-400 group-hover:shadow-md transition-all">
              <ComicCharacter pose={characterPose} gender={panelGender} size={78} />
            </div>
            {isEditable && (
              <div className="absolute -top-1.5 -right-1.5 bg-white border border-slate-300 rounded-full p-0.5 shadow text-[9px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                🔄
              </div>
            )}
          </div>

          {/* 말풍선 목록 (왼쪽 꼬리표: 캐릭터를 가리킴) */}
          <div className="flex-1 space-y-1.5 min-w-0">
            {(panel.speechBubbles && panel.speechBubbles.length > 0
              ? panel.speechBubbles
              : [{ id: `sb-${panelIdx}`, text: '핵심을 기억해요!' }]
            ).map((bubble, bIdx) => (
              <div
                key={bubble.id || bIdx}
                className="speech-bubble speech-bubble-tail-left p-2.5 bg-amber-50/95 border-slate-900 text-[11px] font-bold text-slate-900 leading-snug"
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
        </div>
      </div>

      {/* 5. 독자가 반드시 기억해야 할 한 문장 (패널 하단 띠) */}
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
// 인터랙티브 도식 렌더러 (텍스트 인라인 수정, 객체 조작 툴바 탑재)
// ----------------------------------------------------------------------------------
function renderInteractiveDiagram(
  panel: ComicPanel,
  panelIdx: number,
  isEditable: boolean,
  onTextChange: (path: string, val: string) => void,
  onChangeDiagramType: (idx: number, type: DiagramType) => void,
  onDeleteDiagram: (idx: number) => void,
  onAddDiagramItem: (idx: number) => void,
  onDeleteDiagramItem: (panelIdx: number, itemIdx?: number) => void
) {
  const diagram = panel.diagram;

  // 도식이 삭제되었거나 없는 경우
  if (!diagram || diagram.type === 'none') {
    return (
      <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 text-center">
        <p className="text-[11px] text-slate-400 mb-1.5">도형/표가 비어 있습니다.</p>
        {isEditable && (
          <div className="flex flex-wrap justify-center gap-1">
            <button
              onClick={() => onChangeDiagramType(panelIdx, 'table_compare')}
              className="px-2 py-1 rounded bg-white border border-slate-200 text-[10px] font-bold text-blue-600 hover:bg-blue-50 transition-colors shadow-2xs"
            >
              + 2열 비교표
            </button>
            <button
              onClick={() => onChangeDiagramType(panelIdx, 'cards_compare')}
              className="px-2 py-1 rounded bg-white border border-slate-200 text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 transition-colors shadow-2xs"
            >
              + 비교 카드
            </button>
            <button
              onClick={() => onChangeDiagramType(panelIdx, 'bullet_list')}
              className="px-2 py-1 rounded bg-white border border-slate-200 text-[10px] font-bold text-purple-600 hover:bg-purple-50 transition-colors shadow-2xs"
            >
              + 리스트 박스
            </button>
            <button
              onClick={() => onChangeDiagramType(panelIdx, 'scroll')}
              className="px-2 py-1 rounded bg-white border border-slate-200 text-[10px] font-bold text-amber-600 hover:bg-amber-50 transition-colors shadow-2xs"
            >
              + 두루마리
            </button>
          </div>
        )}
      </div>
    );
  }

  // 1. 고문서 두루마리 (scroll)
  if (diagram.type === 'scroll') {
    return (
      <div className="parchment-scroll p-2.5 text-slate-900 relative">
        <div className="text-[10px] font-black text-amber-900 text-center uppercase tracking-widest border-b border-amber-300 pb-1 mb-1 flex items-center justify-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-amber-800" />
          <span
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) =>
              onTextChange(`panels.${panelIdx}.diagram.title`, e.currentTarget.innerText)
            }
            className="outline-none focus:bg-amber-200/60 rounded px-1"
          >
            {diagram.title || '출발점 질문'}
          </span>
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
          {diagram.highlightText || '우리가 흔히 오해하기 쉬운 본질은 무엇일까요?'}
        </p>
      </div>
    );
  }

  // 2. 2열 대조 비교표 (table_compare)
  if (diagram.type === 'table_compare') {
    const headers = diagram.tableHeaders || ['장로교', '감리교'];
    const rows = diagram.tableRows || [];

    return (
      <div className="space-y-1">
        <div className="rounded-lg overflow-hidden border border-slate-300 text-[10px]">
          {/* 표 헤더 */}
          <div className="grid grid-cols-2 text-center font-black">
            <div
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) =>
                onTextChange(
                  `panels.${panelIdx}.diagram.tableHeaders.0`,
                  e.currentTarget.innerText
                )
              }
              className="p-1 bg-blue-600 text-white outline-none focus:ring-1 focus:ring-white"
            >
              {headers[0]}
            </div>
            <div
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) =>
                onTextChange(
                  `panels.${panelIdx}.diagram.tableHeaders.1`,
                  e.currentTarget.innerText
                )
              }
              className="p-1 bg-emerald-600 text-white outline-none focus:ring-1 focus:ring-white"
            >
              {headers[1]}
            </div>
          </div>

          {/* 표 행들 */}
          <div className="divide-y divide-slate-200 bg-white">
            {rows.map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-2 text-[10px] text-slate-800 relative group/row">
                <div
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onTextChange(
                      `panels.${panelIdx}.diagram.tableRows.${rIdx}.col1`,
                      e.currentTarget.innerText
                    )
                  }
                  className="p-1 px-1.5 border-r border-slate-200 outline-none focus:bg-blue-50/50 font-medium"
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
                  className="p-1 px-1.5 outline-none focus:bg-emerald-50/50 font-medium"
                >
                  {row.col2}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 표 행 추가/삭제 툴바 */}
        {isEditable && (
          <div className="flex items-center justify-end gap-1.5 text-[9px] text-slate-500 no-print">
            <button
              onClick={() => onAddDiagramItem(panelIdx)}
              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-0.5"
            >
              <Plus className="w-2.5 h-2.5" /> 행 추가
            </button>
            {rows.length > 1 && (
              <button
                onClick={() => onDeleteDiagramItem(panelIdx)}
                className="px-1.5 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold flex items-center gap-0.5"
              >
                <Trash2 className="w-2.5 h-2.5" /> 행 삭제
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // 3. 다중 비교 카드 (cards_compare)
  if (diagram.type === 'cards_compare') {
    const items = diagram.items || [];
    return (
      <div className="space-y-1">
        <div className={`grid gap-1 text-center ${items.length > 3 ? 'grid-cols-3 sm:grid-cols-5' : 'grid-cols-3'}`}>
          {items.map((item, i) => (
            <div
              key={i}
              className={`p-1 rounded-lg border text-[10px] flex flex-col justify-between ${
                item.color || 'bg-slate-50 border-slate-200'
              }`}
            >
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onTextChange(
                    `panels.${panelIdx}.diagram.items.${i}.label`,
                    e.currentTarget.innerText
                  )
                }
                className="font-black text-slate-900 block truncate outline-none focus:bg-white rounded px-0.5"
              >
                {item.label}
              </span>
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onTextChange(
                    `panels.${panelIdx}.diagram.items.${i}.description`,
                    e.currentTarget.innerText
                  )
                }
                className="text-[9px] text-slate-600 whitespace-pre-line leading-tight mt-0.5 outline-none focus:bg-white rounded px-0.5"
              >
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
            className="p-1 rounded-md bg-amber-100/90 text-amber-950 font-black text-[10px] text-center outline-none focus:bg-amber-200"
          >
            {diagram.highlightText}
          </div>
        )}

        {isEditable && (
          <div className="flex items-center justify-end gap-1.5 text-[9px] text-slate-500 no-print">
            <button
              onClick={() => onAddDiagramItem(panelIdx)}
              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-0.5"
            >
              <Plus className="w-2.5 h-2.5" /> 카드 추가
            </button>
            {items.length > 1 && (
              <button
                onClick={() => onDeleteDiagramItem(panelIdx)}
                className="px-1.5 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold flex items-center gap-0.5"
              >
                <Trash2 className="w-2.5 h-2.5" /> 카드 삭제
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // 4. 불릿 리스트 (bullet_list)
  if (diagram.type === 'bullet_list') {
    const items = diagram.items || [];
    return (
      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
        <div className="font-extrabold text-[11px] text-blue-900 border-b border-slate-200 pb-1 mb-1 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) =>
                onTextChange(
                  `panels.${panelIdx}.diagram.title`,
                  e.currentTarget.innerText
                )
              }
              className="outline-none focus:bg-white rounded px-0.5"
            >
              {diagram.title || '핵심 원리'}
            </span>
          </div>
          {isEditable && (
            <button
              onClick={() => onAddDiagramItem(panelIdx)}
              className="px-1 py-0.5 rounded bg-blue-100 text-blue-700 font-bold text-[9px] flex items-center gap-0.5 no-print"
            >
              <Plus className="w-2 h-2" /> 추가
            </button>
          )}
        </div>
        <ul className="space-y-0.5">
          {items.map((it, i) => (
            <li key={i} className="text-[10px] text-slate-700 flex items-start gap-1 font-medium">
              <span className="text-blue-500 font-bold">•</span>
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onTextChange(
                    `panels.${panelIdx}.diagram.items.${i}.label`,
                    e.currentTarget.innerText
                  )
                }
                className="outline-none focus:bg-white rounded px-0.5 flex-1"
              >
                {it.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // 5. 강조 인용구 (quote_highlight)
  if (diagram.type === 'quote_highlight') {
    return (
      <div className="p-2 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-center">
        <Quote className="w-3.5 h-3.5 text-amber-600 mx-auto mb-0.5 opacity-70" />
        <p
          contentEditable={isEditable}
          suppressContentEditableWarning
          onBlur={(e) =>
            onTextChange(`panels.${panelIdx}.diagram.quoteText`, e.currentTarget.innerText)
          }
          className="text-[11px] font-black text-amber-950 leading-snug outline-none focus:bg-white/80 rounded"
        >
          {diagram.quoteText || '핵심 메시지를 입력하세요'}
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
            className="text-[10px] font-bold text-amber-800 mt-0.5 outline-none focus:bg-white/80 rounded"
          >
            {diagram.highlightText}
          </p>
        )}
      </div>
    );
  }

  // 6. 키워드 뱃지 (network)
  if (diagram.type === 'network') {
    const items = diagram.items || [];
    return (
      <div className="p-2.5 bg-gradient-to-r from-blue-50/70 via-purple-50/70 to-emerald-50/70 rounded-xl border border-slate-200">
        <div
          contentEditable={isEditable}
          suppressContentEditableWarning
          onBlur={(e) =>
            onTextChange(`panels.${panelIdx}.diagram.title`, e.currentTarget.innerText)
          }
          className="text-center font-black text-[11px] text-slate-800 mb-1.5 outline-none focus:bg-white rounded"
        >
          {diagram.title || '핵심 요소'}
        </div>
        <div className="flex flex-wrap justify-center gap-1.5 mb-1.5">
          {items.map((item, i) => (
            <span
              key={i}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) =>
                onTextChange(
                  `panels.${panelIdx}.diagram.items.${i}.label`,
                  e.currentTarget.innerText
                )
              }
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-2xs outline-none focus:ring-1 focus:ring-white ${
                item.color || 'bg-slate-700 text-white'
              }`}
            >
              {item.label}
            </span>
          ))}
          {isEditable && (
            <button
              onClick={() => onAddDiagramItem(panelIdx)}
              className="px-1.5 py-0.5 rounded-full bg-white border border-slate-300 text-[10px] font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-0.5 no-print"
            >
              <Plus className="w-2.5 h-2.5" /> 뱃지
            </button>
          )}
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

  return null;
}

// ----------------------------------------------------------------------------------
// 기본 도식 데이터 생성기
// ----------------------------------------------------------------------------------
function getDefaultDiagramData(type: DiagramType, title = ''): DiagramData {
  switch (type) {
    case 'table_compare':
      return {
        type: 'table_compare',
        tableHeaders: ['관점 A (특징)', '관점 B (특징)'],
        tableRows: [
          { col1: '핵심 특징 1', col2: '대응되는 특징 1' },
          { col1: '핵심 특징 2', col2: '대응되는 특징 2' },
          { col1: '실천 방안 3', col2: '실천 방안 3' },
        ],
      };
    case 'cards_compare':
      return {
        type: 'cards_compare',
        items: [
          { label: '핵심 A', description: '세부 설명 1\n장점 및 특징', color: 'border-blue-400 bg-blue-50' },
          { label: '핵심 B', description: '세부 설명 2\n장점 및 특징', color: 'border-emerald-400 bg-emerald-50' },
          { label: '핵심 C', description: '세부 설명 3\n장점 및 특징', color: 'border-amber-400 bg-amber-50' },
        ],
        highlightText: '서로 다른 특징, 그러나 조화로운 시너지!',
      };
    case 'bullet_list':
      return {
        type: 'bullet_list',
        title: title || '필수 마스터 포인트',
        items: [
          { label: '첫 번째: 기본 개념 명확히 이해하기' },
          { label: '두 번째: 올바른 적용 원칙 지키기' },
          { label: '세 번째: 꾸준한 실천과 점검' },
        ],
      };
    case 'scroll':
      return {
        type: 'scroll',
        title: '중요 핵심 선언문',
        highlightText: '독자가 깊이 새겨야 할 고문서 또는 권위 있는 선언문 내용입니다.',
      };
    case 'quote_highlight':
      return {
        type: 'quote_highlight',
        quoteText: '“가장 본질적인 진리는 단순하며, 실천할 때 비로소 완성된다.”',
        highlightText: '마음에 새기는 오늘의 핵심 한 줄!',
      };
    case 'network':
      return {
        type: 'network',
        title: '핵심 키워드 연결망',
        items: [
          { label: '기본기', color: 'bg-blue-600 text-white' },
          { label: '유연성', color: 'bg-emerald-600 text-white' },
          { label: '실천력', color: 'bg-amber-600 text-white' },
          { label: '지속성', color: 'bg-purple-600 text-white' },
        ],
        highlightText: '모든 요소가 유기적으로 연결되어 시너지를 창출합니다.',
      };
    case 'none':
    default:
      return { type: 'none' };
  }
}
