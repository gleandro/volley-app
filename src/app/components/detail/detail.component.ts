import { Component, OnInit } from '@angular/core';
import { SerieService } from '../../services/serie.service';
import { NgFor, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-detail',
  imports: [NgStyle, NgFor, NgIf],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  partidos: any[] = [];
  allPlayers: any[] = [];

  constructor(private serieService: SerieService) {}

  ngOnInit(): void {
    this.serieService.getSeries().subscribe((data) => {
      this.partidos = data;
      this.allPlayers = this.getAllPlayers(data);
    });
  }

  getAllPlayers(partidos: any[]): any[] {
    const playersMap = new Map();
    partidos.forEach((partido) => {
      partido.players.forEach((player: any) => {
        if (!playersMap.has(player.id)) {
          playersMap.set(player.id, { id: player.id, name: player.name });
        }
      });
    });
    return Array.from(playersMap.values());
  }

  getPlayerPrice(players: any[], playerId: number): number | null {
    const player = players.find((p) => p.id === playerId);
    return player ? player.price : null;
  }

  calcularTotalJugador(playerId: number): number {
    return this.partidos.reduce((total, partido) => {
      const player = partido.players.find((p: any) => p.id === playerId);
      return total + (player ? player.price : 0);
    }, 0);
  }

  calcularTotal(players: any[]): number {
    return players.reduce((total, player) => total + player.price, 0);
  }
}
