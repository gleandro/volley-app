import Player from "./player";

export interface Serie {
  id: number;
  date: Date;
  games: Game[];
}

export interface Game {
  detail: string;
  players: Player[];
}
