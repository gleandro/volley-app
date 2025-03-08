import { Component } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import Player from '../../interfaces/player';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player',
  imports: [FormsModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css'
})
export class PlayerComponent {
  players: Player[] = [];
  playerName: string = '';
  player: Player = { id: 0, name: '', price: 0 };
  playerFilter: string = '';

  constructor(private playerService: PlayerService) { }

  ngOnInit() {
    this.getPlayers();
  }

  getPlayers() {
    this.playerService.getPlayers().subscribe((players) => {
      this.players = players.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  createPlayer() {
    this.playerService.addPlayer(this.playerName).subscribe((player) => {
      this.players.push(player);
      this.getPlayers();
      this.playerName = '';
      alert('Jugador agregado correctamente');
    });
  }

  deletePlayer(id: number) {
    if (confirm("¿Desea continuar?")) {
      this.playerService.deletePlayer(id).subscribe(() => {
        this.players = this.players.filter((player) => player.id !== id);
        alert('Jugador eliminado correctamente');
      });
    }
  }

  setPlayerToEdit(player: Player) {
    this.player = structuredClone(player);
  }

  updatePlayer() {
    if (!this.player.name.trim()) return;
    this.playerService.updatePlayer(this.player).subscribe(() => {
      this.getPlayers();
      alert('Jugador actualizado correctamente');
    });
  }

  filterPlayers() {
    if (!this.playerFilter.trim()) {
      this.getPlayers();
      return;
    }
    this.playerService.filterPlayers(this.playerFilter).subscribe((players) => {
      this.players = players;
    });
  }

}
