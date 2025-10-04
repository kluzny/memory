export interface Player {
  id: number;
  name: string;
  score: number;
  matches: Card[];
}

export interface Card {
  value: string;
  key: number;
  flipped: boolean;
  owner?: Player;
  dealt: boolean;
}