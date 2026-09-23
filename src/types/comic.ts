export interface SpeechBubble {
  id: string;
  speaker?: string;
  text: string;
  position?: 'left' | 'right' | 'bottom' | 'top' | 'center';
}

export type DiagramType = 
  | 'none' 
  | 'scroll' 
  | 'network' 
  | 'cards_compare' 
  | 'table_compare' 
  | 'bullet_list' 
  | 'quote_highlight';

export interface DiagramData {
  type: DiagramType;
  title?: string;
  items?: {
    label: string;
    description?: string;
    color?: string;
    subItems?: string[];
  }[];
  tableHeaders?: [string, string];
  tableRows?: {
    col1: string;
    col2: string;
  }[];
  quoteText?: string;
  highlightText?: string;
}

export const DIAGRAM_TYPE_OPTIONS: { value: DiagramType; label: string; icon: string; desc: string }[] = [
  { value: 'none', label: '도식 없음 (일러스트/텍스트 중심)', icon: '🚫', desc: '도식 없이 일러스트와 말풍선 위주로 구성' },
  { value: 'scroll', label: '두루마리 박스 (scroll)', icon: '📜', desc: '사도신경, 고문서, 출발점 질문 선언문' },
  { value: 'network', label: '키워드/지체 연결망 (network)', icon: '🌐', desc: '원형 다이어그램, 뱃지 나열, 한 몸 많은 지체' },
  { value: 'bullet_list', label: '체크리스트/불릿 (bullet_list)', icon: '🛡️', desc: '핵심 원리 및 체크포인트 리스트' },
  { value: 'cards_compare', label: '다중 비교 카드 (cards_compare)', icon: '🗂️', desc: '3~5개 인물/교파/유형 카드 대조' },
  { value: 'table_compare', label: '2열 대조 비교표 (table_compare)', icon: '⚖️', desc: '장로교 vs 감리교, 정통 vs 이단 2열 표' },
  { value: 'quote_highlight', label: '인용구 강조 박스 (quote_highlight)', icon: '💬', desc: '정원 비유, 큰따옴표 결론 요약' },
];

export function getDefaultDiagramData(type: DiagramType, title = ''): DiagramData {
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
        title: title || '사도신경 / 중요 선언문',
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
        title: title || '한 몸, 많은 지체',
        items: [
          { label: '장로교', color: 'bg-blue-600 text-white' },
          { label: '감리교', color: 'bg-emerald-600 text-white' },
          { label: '침례교', color: 'bg-amber-600 text-white' },
          { label: '루터교', color: 'bg-rose-600 text-white' },
          { label: '성공회', color: 'bg-purple-600 text-white' },
        ],
        highlightText: '‘몸은 하나인데 지체는 많다’(고전 12:12)',
      };
    case 'none':
    default:
      return { type: 'none' };
  }
}

export interface ComicPanel {
  panelNumber: number; // 1 to 9
  title: string;
  keyMessage: string;
  sceneDescription: string;
  speechBubbles: SpeechBubble[];
  hasDiagram: boolean;
  diagram?: DiagramData;
  mustRemember: string;
  imageUrl?: string;
  imagePrompt?: string;
  badgeColor?: string;
  characterGender?: 'male' | 'female';
}

export interface ComicHeaderDialogue {
  leftCharacter: {
    name?: string;
    dialogue: string;
    gender?: 'male' | 'female';
  };
  rightCharacter: {
    name?: string;
    dialogue: string;
    gender?: 'male' | 'female';
  };
}

export interface ComicProject {
  id: string;
  title: string;
  subtitle: string;
  topic: string;
  audience: string;
  author: string;
  sourceNote?: string;
  characterGender?: 'male' | 'female';
  headerDialogue: ComicHeaderDialogue;
  panels: ComicPanel[];
  createdAt?: string;
  updatedAt?: string;
}
