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

  constructor(private http: HttpClient) {}

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl);
  }
}
