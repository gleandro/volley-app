import { Component, OnInit } from '@angular/core';

import { PlayerService } from '../../services/player.service';
import { FormsModule } from '@angular/forms';
import Player from '../../interfaces/player';
import { Serie, Game } from '../../interfaces/serie';

@Component({
  selector: 'app-home-page',
  imports: [FormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  players: Player[] = [];
  selectedPlayerId: number | null = 0;

  team1: Player[] = [];
  team2: Player[] = [];
  serie: Serie = { id: 1, detail: 'Serie 1', games: [] };

  games: Game[] = [];
  allPlayers: Player[] = [];

  winner: number = 0;
  precio: number = 0;
  monto: number = 0;

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    this.playerService.getPlayers().subscribe((players) => {
      this.players = players;
      console.log(this.players);
    });
  }

  addPlayerToTeam1() {
    const selectedPlayerIndex = this.players.findIndex(
      (player) => player.id == this.selectedPlayerId
    );
    if (selectedPlayerIndex > -1) {
      const [removedPlayer] = this.players.splice(selectedPlayerIndex, 1);
      // Add the player to the other list
      this.team1.push(removedPlayer);
    }
  }

  addPlayerToTeam2() {
    const selectedPlayerIndex = this.players.findIndex(
      (player) => player.id == this.selectedPlayerId
    );
    if (selectedPlayerIndex > -1) {
      const [removedPlayer] = this.players.splice(selectedPlayerIndex, 1);
      // Add the player to the other list
      this.team2.push(removedPlayer);
    }
  }

  guardar() {
    const montoApuesta = this.monto; // Asumiendo que tienes una propiedad 'monto' para el monto apostado
    const ganador = this.winner; // Asumiendo que tienes una propiedad 'winner' para el equipo ganador

    const actualizarPrecioJugador = (player: Player, esGanador: boolean) => {
      player.price = esGanador ? montoApuesta : -montoApuesta;
    };

    this.team1.forEach((player) =>
      actualizarPrecioJugador(player, ganador == 1)
    );
    this.team2.forEach((player) =>
      actualizarPrecioJugador(player, ganador == 2)
    );

    const nuevoPartido: Game = {
      detail: `Partido ${this.serie.games.length + 1}`,
      players: [...this.team1, ...this.team2],
    };

    this.serie.games.push(nuevoPartido);
    this.games = this.serie.games;
    this.allPlayers = this.getAllPlayers(this.games);
  }

  priceStyle(price: number) {
    return {
      color: price > 0 ? 'green' : price < 0 ? 'red' : 'black',
    };
  }

  getAllPlayers(games: Game[]): Player[] {
    const playersMap = new Map();
    games.forEach((game) => {
      game.players.forEach((player: Player) => {
        if (!playersMap.has(player.id)) {
          playersMap.set(player.id, { id: player.id, name: player.name });
        }
      });
    });
    return Array.from(playersMap.values());
  }

  getPlayerPrice(players: Player[], playerId: number): number | null {
    const player = players.find((p) => p.id === playerId);
    return player ? player.price : null;
  }

  calcularTotalJugador(playerId: number): number {
    return this.games.reduce((total, partido) => {
      const player = partido.players.find((p: Player) => p.id === playerId);
      return total + (player ? player.price : 0);
    }, 0);
  }
}
