import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Player from '../interfaces/player';
import { environment } from '../enviroments/enviroment';


@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private apiUrl = `${environment.apiUrl}/players`; // URL parametrizada

  constructor(private http: HttpClient) { }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl);
  }

  addPlayer(name: string): Observable<Player> {
    return this.http.post<Player>(this.apiUrl, { name });
  }

  deletePlayer(id: number): Observable<Player> {
    return this.http.delete<Player>(`${this.apiUrl}/${id}`);
  }

  updatePlayer(player: Player): Observable<Player> {
    return this.http.put<Player>(`${this.apiUrl}/${player.id}`, player);
  }

  filterPlayers(filter: string): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/filter/${filter}`);
  }

}
