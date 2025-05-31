import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../shared/models/movie.model';
import { MovieListComponent } from '../../shared/components/movie-list/movie-list.component';
import { FeaturedCarouselComponent } from '../../shared/components/featured-carousel/featured-carousel.component';
import { CategoriesComponent } from '../../shared/components/categories/categories.component';
import { PopoverController } from '@ionic/angular';
import { LoginPopoverComponent } from '../../shared/components/login-popover/login-popover.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovieListComponent,
    FeaturedCarouselComponent,
    CategoriesComponent
  ]
})
export class HomePage implements OnInit {
  featuredMovies: Movie[] = [];
  recommendedMovies: Movie[] = []; // Antes era popularMovies
  upcomingMovies: Movie[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private movieService: MovieService,
    private router: Router,
    private popoverCtrl: PopoverController
  ) {}

  navigateToSearch() {
    this.router.navigate(['/search']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.loadMovies();
  }

  private currentUpcomingPage = 1;
  private readonly MOVIES_PER_PAGE = 20;
  private initialLoad = true; // Flag para controlar o carregamento inicial

  async loadMovies() {
    try {
      this.loading = true;
      
      // Carrega filmes em destaque (top rated)
      const featured = await this.movieService.getTopRatedMovies(1).toPromise();
      if (featured?.results && featured.results.length > 0) {
        // Filtra apenas filmes de nota alta
        const highRated = featured.results.filter(f => f.vote_average >= 7.5);
        if (highRated.length > 0) {
          // Sorteia um filme aleatório de nota alta
          const randomIndex = Math.floor(Math.random() * highRated.length);
          this.featuredMovies = [highRated[randomIndex]];
        } else {
          // Se não houver nenhum de nota alta, pega o primeiro
          this.featuredMovies = [featured.results[0]];
        }
      } else {
        // Fallback: filmes mockados
        this.featuredMovies = [
          {
            id: 1,
            title: 'Filme Exemplo 1',
            original_title: 'Filme Exemplo 1',
            overview: 'Sinopse do filme exemplo 1.',
            poster_path: '/caminho/poster1.jpg',
            backdrop_path: '/caminho/backdrop1.jpg',
            release_date: '2024-01-01',
            vote_average: 8.5,
            vote_count: 1000,
            popularity: 100,
            genre_ids: [28, 12],
            original_language: 'pt',
            video: false,
            adult: false
          },
          {
            id: 2,
            title: 'Filme Exemplo 2',
            original_title: 'Filme Exemplo 2',
            overview: 'Sinopse do filme exemplo 2.',
            poster_path: '/caminho/poster2.jpg',
            backdrop_path: '/caminho/backdrop2.jpg',
            release_date: '2024-02-01',
            vote_average: 7.9,
            vote_count: 800,
            popularity: 80,
            genre_ids: [16, 35],
            original_language: 'en',
            video: false,
            adult: false
          },
          {
            id: 3,
            title: 'Filme Exemplo 3',
            original_title: 'Filme Exemplo 3',
            overview: 'Sinopse do filme exemplo 3.',
            poster_path: '/caminho/poster3.jpg',
            backdrop_path: '/caminho/backdrop3.jpg',
            release_date: '2024-03-01',
            vote_average: 7.5,
            vote_count: 600,
            popularity: 60,
            genre_ids: [18, 80],
            original_language: 'es',
            video: false,
            adult: false
          }
        ];
      }
      
      // Carrega filmes populares para as indicações (com paginação aleatória) - apenas no carregamento inicial
      if (this.initialLoad) {
        const randomPage = Math.floor(Math.random() * 10) + 1; // Gera uma página aleatória entre 1 e 10
        const popular = await this.movieService.getPopularMovies(randomPage).toPromise();
        if (popular?.results) {
          // Embaralha os filmes e pega os primeiros MOVIES_PER_PAGE
          const shuffled = [...popular.results].sort(() => 0.5 - Math.random());
          this.recommendedMovies = shuffled.slice(0, this.MOVIES_PER_PAGE);
        }
        this.initialLoad = false; // Marca que o carregamento inicial foi concluído
      }
      
      // Carrega lançamentos futuros (sempre a primeira página para ter os mais recentes)
      // Apenas se for o carregamento inicial ou se não houver filmes carregados ainda
      if (this.upcomingMovies.length === 0) {
        const upcoming = await this.movieService.getUpcomingMovies(1).toPromise();
        if (upcoming?.results) {
          // Ordena por data de lançamento (mais recentes primeiro)
          const sortedByDate = [...upcoming.results].sort((a, b) => 
            new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
          );
          this.upcomingMovies = sortedByDate.slice(0, this.MOVIES_PER_PAGE);
        }
      }
      
      this.loading = false;
    } catch (error) {
      console.error('Error loading movies:', error);
      this.error = 'Erro ao carregar os filmes. Tente novamente mais tarde.';
      this.loading = false;
    }
  }

  loadMoreMovies(event: any) {
    // Carrega mais filmes para a lista de lançamentos
    this.currentUpcomingPage++;
    
    this.movieService.getUpcomingMovies(this.currentUpcomingPage).subscribe({
      next: (response) => {
        if (response?.results) {
          // Adiciona os novos filmes à lista existente
          this.upcomingMovies = [...this.upcomingMovies, ...response.results];
        }
        
        if (event && event.target) {
          event.target.complete();
          
          // Desativa o scroll infinito se não houver mais páginas
          if (this.currentUpcomingPage >= (response?.total_pages || 1)) {
            event.target.disabled = true;
          }
        }
      },
      error: (error) => {
        console.error('Error loading more movies:', error);
        if (event && event.target) {
          event.target.complete();
        }
      }
    });
  }

  onFavoriteToggled(event: {movie: Movie, isFavorite: boolean}) {
    const updateMovieInList = (list: Movie[], movieId: number, isFavorite: boolean) => {
      return list.map(movie => 
        movie.id === movieId ? { ...movie, isFavorite } : movie
      );
    };

    if (event.isFavorite) {
      this.movieService.addToFavorites(event.movie).subscribe(success => {
        if (success) {
          // Atualiza o filme na lista de filmes em destaque
          if (this.featuredMovies.some(movie => movie.id === event.movie.id)) {
            this.featuredMovies = updateMovieInList(this.featuredMovies, event.movie.id, event.isFavorite);
          }
          
          // Atualiza o filme na lista de indicações
          if (this.recommendedMovies.some(movie => movie.id === event.movie.id)) {
            this.recommendedMovies = updateMovieInList(this.recommendedMovies, event.movie.id, event.isFavorite);
          }
          
          // Atualiza o filme na lista de lançamentos
          if (this.upcomingMovies.some(movie => movie.id === event.movie.id)) {
            this.upcomingMovies = updateMovieInList(this.upcomingMovies, event.movie.id, event.isFavorite);
          }
        }
      });
    } else {
      this.movieService.removeFromFavorites(event.movie.id).subscribe(success => {
        if (success) {
          // Atualiza o filme na lista de filmes em destaque
          if (this.featuredMovies.some(movie => movie.id === event.movie.id)) {
            this.featuredMovies = updateMovieInList(this.featuredMovies, event.movie.id, event.isFavorite);
          }
          
          // Atualiza o filme na lista de indicações
          if (this.recommendedMovies.some(movie => movie.id === event.movie.id)) {
            this.recommendedMovies = updateMovieInList(this.recommendedMovies, event.movie.id, event.isFavorite);
          }
          
          // Atualiza o filme na lista de lançamentos
          if (this.upcomingMovies.some(movie => movie.id === event.movie.id)) {
            this.upcomingMovies = updateMovieInList(this.upcomingMovies, event.movie.id, event.isFavorite);
          }
        }
      });
    }
  }

  onMovieSelected(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }

  async openLoginPopover(ev: Event) {
    const popover = await this.popoverCtrl.create({
      component: LoginPopoverComponent,
      event: ev,
      dismissOnSelect: true,
      cssClass: 'login-popover'
    });
    await popover.present();
  }
}
