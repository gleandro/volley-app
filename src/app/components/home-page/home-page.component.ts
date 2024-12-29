import { Component, OnInit } from '@angular/core';

import { PlayerService } from '../../services/player.service';
import { FormsModule } from '@angular/forms';
import Player from '../../interfaces/player';
import Serie from '../../interfaces/serie';

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
  serie: Serie | null = null;

  winner: number = 0;
  precio: number = 0;
  monto: number = 0;

  message: string = '';

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
    const costoCancha = this.precio; // Asumiendo que tienes una propiedad 'precio' para el costo de cancha
    const montoApuesta = this.monto; // Asumiendo que tienes una propiedad 'monto' para el monto apostado
    const ganador = this.winner; // Asumiendo que tienes una propiedad 'winner' para el equipo ganador

    const totalJugadores = this.team1.length + this.team2.length;

    const costoPorJugador = costoCancha / totalJugadores;
    const actualizarPrecioJugador = (player: Player, esGanador: boolean) => {
      const costo = -costoPorJugador;
      const apuesta = esGanador ? montoApuesta : -montoApuesta;
      player.price += costo + apuesta;
    };

    this.team1.forEach((player) =>
      actualizarPrecioJugador(player, ganador == 1)
    );
    this.team2.forEach((player) =>
      actualizarPrecioJugador(player, ganador == 2)
    );

    // Construir el mensaje con los detalles de los jugadores y sus deudas
    this.message = 'Detalles de los jugadores y sus deudas:\n\nEquipo 1:\n';
    this.team1.forEach((player) => {
      this.message += `${player.name}: ${player.price}\n`;
    });

    this.message += '\nEquipo 2:\n';
    this.team2.forEach((player) => {
      this.message += `${player.name}: ${player.price}\n`;
    });
  }

  priceStyle(price: number) {
    return {
      color: price > 0 ? 'green' : price < 0 ? 'red' : 'black',
    };
  }
  sendMessage() {
    const phoneNumber = '51959748324'; // Número en formato internacional sin "+" (código país seguido del número).
    const message = encodeURIComponent(this.message);
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank'); // Abre WhatsApp en una nueva pestaña o aplicación.
  }
}
