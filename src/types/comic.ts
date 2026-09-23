export interface SpeechBubble {
  id: string;
  speaker?: string;
  text: string;
  position?: 'left' | 'right' | 'bottom' | 'top' | 'center';
}

export interface DiagramData {
  type: 'none' | 'scroll' | 'network' | 'cards_compare' | 'table_compare' | 'bullet_list' | 'quote_highlight';
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
}

export interface ComicHeaderDialogue {
  leftCharacter: {
    name?: string;
    dialogue: string;
  };
  rightCharacter: {
    name?: string;
    dialogue: string;
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
  headerDialogue: ComicHeaderDialogue;
  panels: ComicPanel[];
  createdAt?: string;
  updatedAt?: string;
}
