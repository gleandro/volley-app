import Player from "./player";

interface Serie {
  id: number;
  date: Date;
  games: game[];
}

interface game {
  detail: string;
  players: Player[];
}

export default Serie;
