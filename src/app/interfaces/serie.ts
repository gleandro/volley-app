import Player from "./player";

export interface Serie {
  id: number;
  detail: string;
  games: Game[];
}

export interface Game {
  detail: string;
  players: Player[];
}
