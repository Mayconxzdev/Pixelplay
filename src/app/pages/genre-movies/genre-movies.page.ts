import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Movie, ApiResponse } from '../../shared/models/movie.model';
import { MovieService } from '../../core/services/movie.service';
import { GenreService } from '../../core/services/genre.service';
import { Subscription } from 'rxjs';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-genre-movies',
  templateUrl: './genre-movies.page.html',
  styleUrls: ['./genre-movies.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    MovieCardComponent,
    DecimalPipe,
    DatePipe
  ]
})
export class GenreMoviesPage implements OnInit, OnDestroy {
  movies: Movie[] = [];
  genreName: string = 'Carregando...';
  isLoading = true;
  error: string | null = null;
  currentPage = 1;
  totalPages = 1;
  genreId: number | null = null;
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private genreService: GenreService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const genreId = params.get('id');
      if (genreId) {
        this.genreId = parseInt(genreId, 10);
        this.loadMoviesByGenre(this.genreId);
      } else {
        this.error = 'Gênero não especificado';
        this.isLoading = false;
      }
    });
  }

  loadMoviesByGenre(genreId: number, page: number = 1) {
    this.isLoading = true;
    this.error = null;
    this.currentPage = page;

    // Primeiro, obtemos o nome do gênero
    const genreSub = this.genreService.getGenres().subscribe({
      next: (genres) => {
        const genre = genres.find(g => g.id === genreId);
        this.genreName = genre?.name || 'Gênero desconhecido';
        
        // Agora carregamos os filmes do gênero
        const moviesSub = this.movieService.getMoviesByGenre(genreId, page).subscribe({
          next: (response: ApiResponse<Movie>) => {
            this.movies = response.results;
            this.totalPages = response.total_pages;
            this.isLoading = false;
          },
          error: (error: any) => {
            console.error('Error loading movies by genre:', error);
            this.error = 'Erro ao carregar filmes. Tente novamente mais tarde.';
            this.isLoading = false;
          }
        });
        this.subscriptions.add(moviesSub);
      },
      error: (error: any) => {
        console.error('Error loading genre:', error);
        this.error = 'Erro ao carregar informações do gênero.';
        this.isLoading = false;
      }
    });
    this.subscriptions.add(genreSub);
  }

  onMovieClick(movie: Movie) {
    this.router.navigate(['/movie', movie.id]);
  }

  onFavoriteToggled(event: { movie: Movie, isFavorite: boolean }) {
    // Aqui você pode adicionar a lógica para atualizar o estado de favorito do filme
    // Por exemplo, chamar um serviço de favoritos
    console.log('Favorite toggled:', event.movie.title, 'isFavorite:', event.isFavorite);
  }

  loadMore(event: any) {
    if (this.currentPage < this.totalPages && this.genreId !== null) {
      this.currentPage++;
      this.movieService.getMoviesByGenre(this.genreId, this.currentPage).subscribe({
        next: (response: ApiResponse<Movie>) => {
          this.movies = [...this.movies, ...response.results];
          event.target.complete();
          
          if (this.currentPage >= this.totalPages) {
            event.target.disabled = true;
          }
        },
        error: (error: any) => {
          console.error('Error loading more movies:', error);
          event.target.complete();
        }
      });
    } else {
      event.target.disabled = true;
    }
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
