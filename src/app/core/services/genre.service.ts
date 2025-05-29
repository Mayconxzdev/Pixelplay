import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface Genre {
  id: number;
  name: string;
}

interface GenreResponse {
  genres: Genre[];
}

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private readonly apiKey = environment.tmdbApiKey;
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private genres: Genre[] = [];
  private genresLoaded = false;
  private genresSubject = new BehaviorSubject<Genre[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Obtém a lista de gêneros de filmes
   * @returns Observable com a lista de gêneros
   */
  getGenres(): Observable<Genre[]> {
    console.log('getGenres called');
    if (this.genresLoaded) {
      console.log('Returning cached genres:', this.genres);
      return of(this.genres);
    }

    console.log('Fetching genres from API...');
    const url = `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=pt-BR`;
    console.log('API URL:', url);

    return this.http.get<GenreResponse>(url).pipe(
      map(response => {
        console.log('Genres API response:', response);
        return response.genres || [];
      }),
      tap(genres => {
        console.log('Genres loaded successfully:', genres);
        this.genres = genres;
        this.genresLoaded = true;
        this.genresSubject.next(genres);
      }),
      catchError(error => {
        console.error('Error fetching genres:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtém o nome do gênero pelo ID
   * @param genreId ID do gênero
   * @returns Nome do gênero ou string vazia se não encontrado
   */
  getGenreName(genreId: number): string {
    const genre = this.genres.find(g => g.id === genreId);
    return genre ? genre.name : '';
  }

  /**
   * Obtém os nomes dos gêneros a partir de uma lista de IDs
   * @param genreIds Lista de IDs de gêneros
   * @returns Lista de nomes de gêneros
   */
  getGenreNames(genreIds: number[]): string[] {
    return genreIds
      .map(id => this.getGenreName(id))
      .filter(name => name !== '');
  }

  /**
   * Obtém os gêneros como um Observable
   */
  getGenres$(): Observable<Genre[]> {
    return this.genresSubject.asObservable();
  }

  /**
   * Carrega os gêneros se ainda não foram carregados
   */
  loadGenresIfNeeded(): void {
    if (!this.genresLoaded) {
      this.getGenres().subscribe();
    }
  }
}
