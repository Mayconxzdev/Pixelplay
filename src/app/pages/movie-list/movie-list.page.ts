import { Component, OnInit, inject, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonContent } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../shared/models/movie.model';
import { MovieListComponent } from '../../shared/components/movie-list/movie-list.component';
import { finalize } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.page.html',
  styleUrls: ['./movie-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    MovieListComponent
  ]
})
export class MovieListPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  
  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);

  movies: Movie[] = [];
  title = '';
  listType: 'popular' | 'upcoming' | 'top_rated' = 'popular';
  currentPage = 1;
  totalPages = 1;
  loading = true;
  error: string | null = null;
  showScrollToTop = false;
  private scrollThreshold = 300; // Distância de rolagem para mostrar o botão

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.title = data['title'] || 'Filmes';
      this.listType = data['listType'] || 'popular';
      this.loadMovies();
    });
  }

  async loadMovies(event?: any) {
    try {
      this.loading = true;
      this.error = null;
      
      const loading = await this.loadingCtrl.create({
        message: 'Carregando filmes...',
        spinner: 'bubbles'
      });
      
      await loading.present();

      let movieObservable;
      
      switch (this.listType) {
        case 'popular':
          movieObservable = this.movieService.getPopularMovies(this.currentPage);
          break;
        case 'upcoming':
          movieObservable = this.movieService.getUpcomingMovies(this.currentPage);
          break;
        case 'top_rated':
          movieObservable = this.movieService.getTopRatedMovies(this.currentPage);
          break;
        default:
          movieObservable = this.movieService.getPopularMovies(this.currentPage);
      }

      movieObservable
        .pipe(
          finalize(() => {
            this.loading = false;
            loading.dismiss();
            if (event) event.target.complete();
          })
        )
        .subscribe({
          next: (response) => {
            if (this.currentPage === 1) {
              this.movies = [];
            }
            this.movies = [...this.movies, ...response.results];
            this.totalPages = response.total_pages;
          },
          error: (err) => {
            console.error('Erro ao carregar filmes:', err);
            this.error = 'Não foi possível carregar a lista de filmes. Tente novamente mais tarde.';
          }
        });
    } catch (err) {
      console.error('Erro ao carregar filmes:', err);
      this.loading = false;
      this.error = 'Ocorreu um erro ao carregar os filmes.';
      if (event) event.target.complete();
    }
  }

  loadMore(event: any) {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadMovies(event);
    } else {
      event.target.disabled = true;
    }
  }

  onMovieSelected(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }

  // Monitora o evento de rolagem para mostrar/ocultar o botão de voltar ao topo
  @HostListener('ionScroll', ['$event']) onScroll($event: any) {
    const scrollTop = $event.detail.scrollTop;
    this.showScrollToTop = scrollTop > this.scrollThreshold;
  }

  // Rola a página para o topo
  scrollToTop() {
    this.content.scrollToTop(500); // 500ms de duração da animação
  }

  // Atualiza a lista de filmes
  refreshMovies(event: any) {
    this.currentPage = 1;
    this.movies = [];
    this.loadMovies(event);
  }

  onFavoriteToggled(event: { movie: Movie, isFavorite: boolean }) {
    // Lógica para favoritar/desfavoritar filme
    console.log('Filme favoritado/desfavoritado:', event.movie, 'isFavorite:', event.isFavorite);
    
    if (event.isFavorite) {
      this.movieService.addToFavorites(event.movie).subscribe({
        next: () => {
          console.log('Filme adicionado aos favoritos');
        },
        error: (err) => {
          console.error('Erro ao adicionar filme aos favoritos:', err);
        }
      });
    } else {
      this.movieService.removeFromFavorites(event.movie.id).subscribe({
        next: () => {
          console.log('Filme removido dos favoritos');
        },
        error: (err) => {
          console.error('Erro ao remover filme dos favoritos:', err);
        }
      });
    }
  }
}
