import { Component, OnInit } from '@angular/core';
import { SerieService } from '../../services/serie.service';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import Player from '../../interfaces/player';
import { Serie } from '../../interfaces/serie';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  series: Serie[] = [];
  allPlayers: Player[] = [];

  constructor(private serieService: SerieService) {}

  ngOnInit(): void {
    this.serieService.getSeries().subscribe((data) => {
      console.log('Datos recibidos:', data); // Verifica los datos recibidos
      this.series = data;
      this.allPlayers = this.getAllPlayers(data);
    });
  }

  getAllPlayers(series: Serie[]): Player[] {
    const playersMap = new Map<number, Player>();

    if (!Array.isArray(series)) {
      console.error('Series no es un array válido');
      return [];
    }

    series.forEach((serie) => {
      if (serie && Array.isArray(serie.games)) {
        serie.games.forEach((game) => {
          if (game && Array.isArray(game.players)) {
            game.players.forEach((player) => {
              if (player && !playersMap.has(player.id)) {
                playersMap.set(player.id, player);
              }
            });
          }
        });
      }
    });

    return Array.from(playersMap.values());
  }

  calcularTotal(players: Player[]): number {
    return players.reduce((total, player) => total + player.price, 0);
  }

  calcularTotalJugador(playerId: number): number {
    let total = 0;
    this.series.forEach((serie) => {
      serie.games.forEach((game) => {
        game.players.forEach((player) => {
          if (player.id === playerId) {
            total += player.price; // Sumar el valor de cada partido
          }
        });
      });
    });
    return total;
  }

  calcularTotalPorDia(serie: Serie): number {
    let total = 0;
    serie.games.forEach((game) => {
      total += this.calcularTotal(game.players);
    });
    return total;
  }
}
