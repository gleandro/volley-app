import Player from "./player";

interface Serie {
  id: number;
  detail: string;
  games: game[];
}

interface game {
  detail: string;
  players: Player[];
}

export default Serie;
