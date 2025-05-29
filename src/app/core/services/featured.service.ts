import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Movie } from '../../shared/models/movie.model';
import { MovieService } from './movie.service';

export interface FeaturedContent {
  trending: Movie[];
  popular: Movie[];
  topRated: Movie[];
  upcoming: Movie[];
}

@Injectable({
  providedIn: 'root'
})
export class FeaturedService {
  private featuredContent = new BehaviorSubject<FeaturedContent>({
    trending: [],
    popular: [],
    topRated: [],
    upcoming: []
  });

  constructor(private movieService: MovieService) {}

  /**
   * Obtém o conteúdo em destaque
   */
  getFeaturedContent(): Observable<FeaturedContent> {
    return this.featuredContent.asObservable();
  }

  /**
   * Carrega o conteúdo em destaque
   */
  loadFeaturedContent(): void {
    // Carrega filmes populares
    this.movieService.getPopularMovies(1).subscribe(popular => {
      const current = this.featuredContent.value;
      this.featuredContent.next({
        ...current,
        popular: popular.results.slice(0, 10)
      });
    });

    // Carrega filmes mais bem avaliados
    this.movieService.getTopRatedMovies(1).subscribe(topRated => {
      const current = this.featuredContent.value;
      this.featuredContent.next({
        ...current,
        topRated: topRated.results.slice(0, 10)
      });
    });

    // Carrega próximos lançamentos
    this.movieService.getUpcomingMovies(1).subscribe(upcoming => {
      const current = this.featuredContent.value;
      this.featuredContent.next({
        ...current,
        upcoming: upcoming.results.slice(0, 10)
      });
    });
  }

  /**
   * Alterna um filme como favorito
   * @param movie Filme a ser alternado
   */
  toggleFavorite(movie: Movie): void {
    this.movieService.toggleFavorite(movie).subscribe(success => {
      if (success) {
        this.updateFeaturedContent(movie);
      }
    });
  }

  /**
   * Atualiza o conteúdo em destaque após uma alteração
   * @param updatedMovie Filme atualizado
   */
  private updateFeaturedContent(updatedMovie: Movie): void {
    const current = this.featuredContent.value;
    
    const updateList = (movies: Movie[]) => 
      movies.map(movie => 
        movie.id === updatedMovie.id ? { ...movie, isFavorite: updatedMovie.isFavorite } : movie
      );

    this.featuredContent.next({
      trending: updateList(current.trending),
      popular: updateList(current.popular),
      topRated: updateList(current.topRated),
      upcoming: updateList(current.upcoming)
    });
  }
}
