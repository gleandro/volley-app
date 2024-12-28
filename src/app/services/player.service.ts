import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Player from '../interfaces/player';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private jsonUrl = 'player.json';

  constructor(private http: HttpClient) {}

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.jsonUrl);
  }
}
