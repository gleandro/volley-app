import { Component, OnInit } from '@angular/core';

import { PlayerService } from '../../services/player.service';
import { FormsModule } from '@angular/forms';
import Player from '../../interfaces/player';
import { Serie, Game } from '../../interfaces/serie';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import { timeout } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-home-page',
  imports: [FormsModule, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  players: Player[] = [];
  selectedPlayerId: number | null = 0;

  team1: Player[] = [];
  team2: Player[] = [];
  serie: Serie = { id: 1, date: new Date('2024-12-28'), games: [] };

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

  addPlayerToTeam(t: number) {
    const selectedPlayerIndex = this.players.findIndex(
      (player) => player.id == this.selectedPlayerId
    );
    if (selectedPlayerIndex > -1) {
      const [removedPlayer] = this.players.splice(selectedPlayerIndex, 1);
      // Add the player to the other list
      const team = t == 1 ? this.team1 : this.team2;
      team.push(removedPlayer);
      setTimeout(() => {
        this.selectedPlayerId = 0;
      }, 10);
    }
  }

  removePlayerFromTeam(playerId: number, t: number) {
    const team = t == 1 ? this.team1 : this.team2;
    const playerIndex = team.findIndex((player) => player.id === playerId);
    if (playerIndex > -1) {
      const [removedPlayer] = team.splice(playerIndex, 1);
      this.players.push(removedPlayer);
    }
  }

  validation(): Boolean {
    if (this.team1.length == 0 || this.team2.length == 0) {
      alert('Debes seleccionar jugadores para ambos equipos');
      return false;
    }

    if (this.monto <= 0) {
      alert('Debes ingresar un monto válido');
      return false;
    }

    if (this.winner == 0) {
      alert('Debes seleccionar un ganador');
      return false;
    }
    return true;
  }

  saveGame() {
    const valid = this.validation();
    if (!valid) return;

    const montoApuesta = this.monto; // Asumiendo que tienes una propiedad 'monto' para el monto apostado
    const ganador = this.winner; // Asumiendo que tienes una propiedad 'winner' para el equipo ganador

    const equipoGanador = ganador == 1 ? this.team1 : this.team2;
    const equipoPerdedor = ganador == 1 ? this.team2 : this.team1;
  
    const totalApuesta = montoApuesta * equipoPerdedor.length;
    const gananciaPorJugador = totalApuesta / equipoGanador.length;

    const actualizarPrecioJugador = (player: Player, esGanador: boolean) => {
      player.price = esGanador ? gananciaPorJugador : -montoApuesta;
    };

    this.team1.forEach((player) =>
      actualizarPrecioJugador(player, ganador == 1)
    );
    this.team2.forEach((player) =>
      actualizarPrecioJugador(player, ganador == 2)
    );

    const nuevoPartido: Game = {
      id: this.serie.games.length + 1,
      detail: `Partido ${this.serie.games.length + 1}`,
      players: [...structuredClone(this.team1), ...structuredClone(this.team2)],
    };

    this.serie.games.push(nuevoPartido);
    this.games = this.serie.games;
    this.allPlayers = this.getAllPlayers(this.games);

    console.log(this.serie);
  }

  removeGame(gameId: number) {
    const gameIndex = this.serie.games.findIndex((game) => game.id === gameId);
    if (gameIndex > -1) {
      this.serie.games.splice(gameIndex, 1);
      this.games = this.serie.games;
      this.allPlayers = this.getAllPlayers(this.games);
    }
  }

  saveSerie() {
    const precioCompartido = this.precio / this.allPlayers.length;
    let playersShared = structuredClone(this.allPlayers);

    playersShared.forEach((player) => {
      player.price = -precioCompartido;
    });

    const nuevoPartido: Game = {
      id: this.serie.games.length + 1,
      detail: `Cancha/Palos`,
      players: playersShared,
    };

    this.serie.games.push(nuevoPartido);
    this.games = this.serie.games;
    this.allPlayers = this.getAllPlayers(this.games);

    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }
  }

  openModal() {
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  priceStyle(price: number) {
    return price > 0
      ? 'text-success'
      : price < 0
      ? 'text-danger'
      : 'text-secondary';
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

  exportTableAsImage() {
    const tableElement = document.getElementById('tableExport'); // Asegúrate de asignar un ID al contenedor de la tabla
    if (tableElement) {
      html2canvas(tableElement).then((canvas) => {
        const image = canvas.toDataURL('image/png');
        this.downloadImage(image, 'table.png');
      });
    }
  }

  downloadImage(dataUrl: string, filename: string) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
