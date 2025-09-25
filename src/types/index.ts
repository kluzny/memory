export interface Player {
  id: number;
  name: string;
  score: number;
  active: boolean;
}

export interface Card {
  value: string;
  key: number;
  found: boolean;
  flipped: boolean;
}