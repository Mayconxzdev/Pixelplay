import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of, forkJoin } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { Movie, MovieDetails, ApiResponse } from '../../shared/models/movie.model';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private favorites: Movie[] = [];
  private favoritesSubject = new BehaviorSubject<Movie[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    this.storageService.getFavorites().subscribe({
      next: (favorites: Movie[]) => {
        this.favorites = favorites || [];
        this.favoritesSubject.next([...this.favorites]);
      },
      error: (error: any) => {
        console.error('Error loading favorites:', error);
        this.favorites = [];
        this.favoritesSubject.next([]);
      }
    });
  }

  getTopRatedMovies(page: number = 1): Observable<ApiResponse<Movie>> {
    return this.apiService.getTopRatedMovies(page).pipe(
      map(response => this.markFavorites(response)),
      catchError(error => {
        console.error('Error fetching top rated movies:', error);
        return of({ page: 1, results: [], total_pages: 0, total_results: 0 });
      })
    );
  }

  getUpcomingMovies(page: number = 1): Observable<ApiResponse<Movie>> {
    return this.apiService.getUpcomingMovies(page).pipe(
      map(response => this.markFavorites(response)),
      catchError(error => {
        console.error('Error fetching upcoming movies:', error);
        return of({ page: 1, results: [], total_pages: 0, total_results: 0 });
      })
    );
  }

  getPopularMovies(page: number = 1): Observable<ApiResponse<Movie>> {
    return this.apiService.getPopularMovies(page).pipe(
      map(response => this.markFavorites(response)),
      catchError(error => {
        console.error('Error fetching popular movies:', error);
        return of({ page: 1, results: [], total_pages: 0, total_results: 0 });
      })
    );
  }

  searchMovies(query: string, page: number = 1): Observable<ApiResponse<Movie>> {
    if (!query || query.trim().length === 0) {
      return of({ page: 1, results: [], total_pages: 0, total_results: 0 });
    }
    
    return this.apiService.searchMovies(query, page).pipe(
      map(response => this.markFavorites(response)),
      catchError(error => {
        console.error('Error searching movies:', error);
        return of({ page: 1, results: [], total_pages: 0, total_results: 0 });
      })
    );
  }

  /**
   * Obtém filmes por gênero
   * @param genreId ID do gênero
   * @param page Número da página
   * @returns Observable com a lista de filmes do gênero
   */
  getMoviesByGenre(genreId: number, page: number = 1): Observable<ApiResponse<Movie>> {
    return this.apiService.getMoviesByGenre(genreId, page).pipe(
      map(response => this.markFavorites(response)),
      catchError(error => {
        console.error('Error fetching movies by genre:', error);
        return of({ page: 1, results: [], total_pages: 0, total_results: 0 });
      })
    );
  }

  getMovieDetails(movieId: number): Observable<MovieDetails> {
    return this.apiService.getMovieDetails(movieId).pipe(
      map((movieDetails: MovieDetails) => ({
        ...movieDetails,
        poster_path: movieDetails.poster_path || 'assets/images/no-poster.jpg',
        backdrop_path: movieDetails.backdrop_path || '',
        vote_average: movieDetails.vote_average || 0,
        vote_count: movieDetails.vote_count || 0,
        popularity: movieDetails.popularity || 0,
        genres: movieDetails.genres || [],
        credits: movieDetails.credits || { cast: [], crew: [] },
        similar: movieDetails.similar || { page: 1, results: [], total_pages: 0, total_results: 0 }
      })),
      switchMap((movieDetails: MovieDetails) => {
        return this.isFavorite(movieDetails.id).pipe(
          map(isFavorite => ({
            ...movieDetails,
            isFavorite
          }))
        );
      }),
      catchError((error: any) => {
        console.error('Error fetching movie details:', error);
        throw error;
      })
    );
  }

  private markFavorites(response: ApiResponse<Movie>): ApiResponse<Movie> {
    if (!response || !response.results) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
    
    const favoriteIds = new Set(this.favorites.map(m => m.id));
    return {
      ...response,
      results: response.results.map(movie => ({
        ...movie,
        isFavorite: favoriteIds.has(movie.id)
      }))
    };
  }

  addToFavorites(movie: Movie): Observable<boolean> {
    // Verifica se o filme já está nos favoritos
    const existingIndex = this.favorites.findIndex(m => m.id === movie.id);
    if (existingIndex !== -1) {
      return of(true); // Já está nos favoritos
    }

    const movieToAdd: Movie = {
      ...movie,
      original_title: movie.original_title || movie.title,
      backdrop_path: movie.backdrop_path || '',
      vote_count: movie.vote_count || 0,
      popularity: movie.popularity || 0,
      original_language: movie.original_language || 'en',
      video: movie.video || false,
      adult: movie.adult || false,
      genre_ids: movie.genre_ids || [],
      poster_path: movie.poster_path || 'assets/images/no-poster.jpg',
      overview: movie.overview || '',
      release_date: movie.release_date || '',
      isFavorite: true // Garante que o estado esteja correto
    };

    return new Observable<boolean>(subscriber => {
      this.storageService.addToFavorites(movieToAdd).then(
        (success: boolean) => {
          if (success) {
            this.favorites = [...this.favorites, movieToAdd];
            this.favoritesSubject.next([...this.favorites]);
          }
          subscriber.next(success);
          subscriber.complete();
        },
        (error: any) => {
          console.error('Error adding to favorites:', error);
          subscriber.next(false);
          subscriber.complete();
        }
      );
    });
  }

  removeFromFavorites(movieId: number): Observable<boolean> {
    // Verifica se o filme está nos favoritos
    const existingIndex = this.favorites.findIndex(m => m.id === movieId);
    if (existingIndex === -1) {
      return of(true); // Já não está nos favoritos
    }

    return new Observable<boolean>(subscriber => {
      this.storageService.removeFromFavorites(movieId).then(
        (success: boolean) => {
          if (success) {
            this.favorites = this.favorites.filter(m => m.id !== movieId);
            this.favoritesSubject.next([...this.favorites]);
          }
          subscriber.next(success);
          subscriber.complete();
        },
        (error: any) => {
          console.error('Error removing from favorites:', error);
          subscriber.next(false);
          subscriber.complete();
        }
      );
    });
  }

  isFavorite(movieId: number): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
      const subscription = this.favoritesSubject.subscribe(favorites => {
        const isFavorite = favorites.some(movie => movie.id === movieId);
        subscriber.next(isFavorite);
      });
      
      return () => subscription.unsubscribe();
    });
  }

  /**
   * Obtém os vídeos de um filme (trailers, teasers, etc.)
   * @param movieId ID do filme
   * @returns Observable com os vídeos do filme
   */
  getMovieVideos(movieId: number): Observable<any[]> {
    console.log(`Buscando vídeos para o filme ID: ${movieId}`);
    return this.apiService.getMovieVideos(movieId).pipe(
      map(response => {
        console.log('Resposta da API de vídeos:', response);
        return response.results || [];
      }),
      map(videos => {
        const filteredVideos = videos.filter(video => 
          video.site === 'YouTube' && 
          video.type === 'Trailer' && 
          video.official === true
        );
        console.log('Vídeos filtrados:', filteredVideos);
        return filteredVideos;
      }),
      catchError(error => {
        console.error('Error fetching movie videos:', error);
        return of([]);
      })
    );
  }

  toggleFavorite(movie: Movie): Observable<boolean> {
    return this.isFavorite(movie.id).pipe(
      switchMap(isFavorite => {
        if (isFavorite) {
          return this.removeFromFavorites(movie.id);
        } else {
          return this.addToFavorites(movie);
        }
      })
    );
  }
}
