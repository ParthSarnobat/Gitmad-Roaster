export interface RoastStats {
  sanity: number;
  efficiency: number;
  style: number;
}

export interface RoastCard {
  archetype: string;
  score: number; // 0-100 Code Quality
  emoji: string;
  image_prompt: string; // Description for AI image generator
  theme_color: string; // Hex code
  quote: string;
  stats: RoastStats;
  details: string; // The full roast paragraph
}

export interface FixResult {
  mode: 'fix';
  fixed_code: string;
  explanation: string;
  new_rank: string;
}

export type RoastResponse = RoastCard | FixResult;

export interface RoastState {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: RoastCard | null;
  errorMessage: string | null;
}

export enum RoastMood {
  SAVAGE = 'SAVAGE',
  CONSTRUCTIVE = 'CONSTRUCTIVE',
}