import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Movie } from '../../shared/models/movie.model';
import { MovieService } from '../../core/services/movie.service';
import { MovieListComponent } from '../../shared/components/movie-list/movie-list.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovieListComponent
  ]
})
export class FavoritesPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  favoriteMovies: Movie[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  public loadFavorites() {
    this.loading = true;
    this.error = null;
    
    this.movieService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (movies) => {
          this.favoriteMovies = movies;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading favorites:', error);
          this.error = 'Erro ao carregar os filmes favoritos';
          this.loading = false;
        }
      });
  }

  onMovieSelected(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }

  onFavoriteToggled(event: {movie: Movie, isFavorite: boolean}) {
    if (event?.movie) {
      const operation = event.isFavorite 
        ? this.movieService.addToFavorites(event.movie)
        : this.movieService.removeFromFavorites(event.movie.id);
      
      operation.pipe(takeUntil(this.destroy$)).subscribe();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
