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
