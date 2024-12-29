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

  saveGame() {
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
      players: [...structuredClone(this.team1), ...structuredClone(this.team2)],
    };

    this.serie.games.push(nuevoPartido);
    this.games = this.serie.games;
    this.allPlayers = this.getAllPlayers(this.games);
  }

  saveSerie() {
    const precioCompartido = this.precio / this.allPlayers.length;
    let playersShared = structuredClone(this.allPlayers);

    playersShared.forEach((player) => {
      player.price = -precioCompartido;
    });

    const nuevoPartido: Game = {
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
