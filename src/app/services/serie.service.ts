import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Serie } from '../interfaces/serie';

@Injectable({
  providedIn: 'root',
})
export class SerieService {
  private jsonUrl = 'serie.json';

  constructor(private http: HttpClient) {}

  getSeries(): Observable<Serie[]> {
    return this.http.get<Serie[]>(this.jsonUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener las series:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }
}
