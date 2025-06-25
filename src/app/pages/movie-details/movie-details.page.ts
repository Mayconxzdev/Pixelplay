import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild, AfterViewInit, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, switchMap, fromEvent, debounceTime } from 'rxjs';

// Services
import { MovieService } from '../../core/services/movie.service';
import { GenreService } from '../../core/services/genre.service';
import { Movie, MovieDetails } from '../../shared/models/movie.model';

// Components
import { IonHeader, IonContent, IonTitle, IonicModule, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule
  ]
})
export class MovieDetailsPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild('headerTitle') headerTitle!: any; // Usando any para evitar problemas com a propriedade el
  @ViewChild('headerToolbar') headerToolbar!: any; // Usando any para evitar problemas com a propriedade el
  @ViewChild('youtubeIframe') youtubeIframe!: ElementRef;
  
  private scrollSubscription: Subscription | null = null;
  private headerHeight = 64; // Altura do cabeçalho em pixels
  movie: MovieDetails | null = null;
  loading = true;
  error: string | null = null;
  trailerUrl: string | null = null;
  showTrailer = false;
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private genreService: GenreService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private sanitizer: DomSanitizer
  ) {}

  ngAfterViewInit() {
    this.setupScrollListener();
  }

  private setupScrollListener() {
    // Usando o próprio content do Ionic para gerenciar o scroll
    this.scrollSubscription = fromEvent(window, 'scroll')
      .pipe(debounceTime(10))
      .subscribe((event) => this.onContentScroll(event));
  }

  onContentScroll(event: any) {
    const scrollTop = event?.target?.scrollTop || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const toolbarElement = this.headerToolbar?.el;
    const titleElement = this.headerTitle?.el;
    const backdrop = document.querySelector('.backdrop') as HTMLElement;

    // Efeito de parallax no backdrop
    if (backdrop) {
      const translateValue = scrollTop * 0.5; // Ajuste a intensidade do efeito aqui
      backdrop.style.transform = `translate3d(0, ${translateValue}px, 0)`;
    }

    // Opacidade do overlay do backdrop
    const backdropOverlay = document.querySelector('.backdrop-overlay') as HTMLElement;
    if (backdropOverlay) {
      const opacity = Math.min(scrollTop / 200, 0.8); // Ajuste a velocidade do fade
      backdropOverlay.style.opacity = opacity.toString();
    }

    // Mostra/esconde o título no cabeçalho
    if (toolbarElement && titleElement) {
      if (scrollTop > 100) {
        titleElement.classList.add('visible');
        toolbarElement.classList.add('scrolled');
      } else {
        titleElement.classList.remove('visible');
        toolbarElement.classList.remove('scrolled');
      }
    }
  }

  ngOnInit() {
    // Carrega os detalhes iniciais
    this.loadMovieDetails();
    
    // Se inscreve nas mudanças de parâmetros da rota
    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        const movieId = params.get('id');
        if (movieId) {
          // Reseta o estado
          this.movie = null;
          this.loading = true;
          this.error = null;
          
          // Recarrega os detalhes do novo filme
          this.loadMovieDetails();
        }
      })
    );
  }

  ngOnDestroy() {
    // Limpa o trailer ao destruir o componente
    this.clearTrailer();
    
    this.subscriptions.unsubscribe();
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

  // Navega para a página de detalhes de uma pessoa
  viewPersonDetails(personId: number, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.router.navigate(['/person', personId]);
  }

  // Exibe todos os filmes similares
  viewAllSimilar() {
    if (this.movie?.id) {
      this.router.navigate(['/similar-movies', this.movie.id]);
    }
  }

  // Manipula erros de carregamento de imagem
  onImageError(event: any, imageType: 'poster' | 'backdrop' | 'profile' | 'logo') {
    const imgElement = event.target as HTMLImageElement;
    
    // Define um placeholder baseado no tipo de imagem
    switch (imageType) {
      case 'poster':
        imgElement.src = 'assets/images/no-poster.jpg';
        break;
      case 'backdrop':
        // Para o backdrop, podemos usar uma cor de fundo ou um placeholder
        const backdropContainer = imgElement.closest('.backdrop');
        if (backdropContainer) {
          backdropContainer.classList.add('no-backdrop-image');
        }
        // Tenta carregar o poster como fallback
        if (this.movie?.poster_path) {
          imgElement.src = `https://image.tmdb.org/t/p/w1280${this.movie.poster_path}`;
        }
        break;
      case 'profile':
        imgElement.src = 'assets/avatar-placeholder.png';
        break;
      case 'logo':
        imgElement.style.display = 'none'; // Esconde o logo se não carregar
        break;
    }
    
    // Remove o manipulador de erro para evitar loops
    imgElement.onerror = null;
  }

  private async loadMovieDetails() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.error = 'ID do filme não fornecido';
      this.loading = false;
      return;
    }
    
    // Limpa o trailer atual
    this.clearTrailer();
    
    this.loading = true;
    this.error = null;
    
    // Cancela requisições anteriores para evitar race conditions
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
      this.subscriptions = new Subscription();
    }
    
    // Carrega os vídeos do filme
    this.loadMovieVideos(+id);

    this.subscriptions.add(
      this.movieService.getMovieDetails(+id).subscribe({
        next: (movie) => {
          this.movie = movie;
          this.loading = false;
          
          // Rola para o topo após carregar
          if (this.content) {
            this.content.scrollToTop(300);
          }
        },
        error: (error) => {
          console.error('Error loading movie details:', error);
          this.error = 'Erro ao carregar os detalhes do filme';
          this.loading = false;
          
          this.toastCtrl.create({
            message: 'Erro ao carregar os detalhes do filme',
            duration: 3000,
            position: 'bottom',
            color: 'danger'
          }).then(toast => toast.present());
          
          this.router.navigate(['/home']);
        }
      })
    );
  }

  // Obtém os nomes dos gêneros formatados como tags
  getGenreNames(genreIds: number[]): string[] {
    return this.genreService.getGenreNames(genreIds);
  }

  // Método de compatibilidade para templates antigos
  getGenres(genreIds: number[]): string {
    return this.genreService.getGenreNames(genreIds).join(', ');
  }

  getYearFromDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).getFullYear().toString();
  }

  getRatingColor(rating: number): string {
    if (!rating) return 'no-rating';
    if (rating >= 7.5) return 'high';
    if (rating >= 5) return 'medium';
    return 'low';
  }

  async presentToast(message: string, icon: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
      buttons: [{
        icon,
        role: 'cancel'
      }]
    });
    await toast.present();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  async toggleFavorite() {
    if (!this.movie) return;
    
    // Adiciona uma pequena animação de clique
    const favoriteButton = document.querySelector('.favorite-button');
    if (favoriteButton) {
      favoriteButton.classList.add('clicked');
      setTimeout(() => favoriteButton.classList.remove('clicked'), 300);
    }
    
    // Cria um objeto Movie básico para o toggleFavorite
    const movieToToggle: Movie = {
      id: this.movie.id,
      title: this.movie.title,
      poster_path: this.movie.poster_path,
      backdrop_path: this.movie.backdrop_path,
      release_date: this.movie.release_date,
      vote_average: this.movie.vote_average,
      overview: this.movie.overview,
      genre_ids: this.movie.genres?.map(g => g.id) || [],
      original_title: this.movie.original_title,
      original_language: this.movie.original_language,
      popularity: this.movie.popularity,
      vote_count: this.movie.vote_count,
      video: false,
      adult: this.movie.adult || false,
      isFavorite: this.movie.isFavorite
    };
    
    this.movieService.toggleFavorite(movieToToggle).subscribe({
      next: (isFavorite) => {
        if (this.movie) {
          // Adiciona a classe de animação quando o filme é favoritado
          if (isFavorite) {
            const heartIcon = document.querySelector('.favorite-button ion-icon');
            if (heartIcon) {
              heartIcon.classList.add('heart-beat');
              setTimeout(() => heartIcon.classList.remove('heart-beat'), 1000);
            }
          }
          
          this.movie.isFavorite = isFavorite;
          this.presentToast(
            isFavorite ? 'Adicionado aos favoritos' : 'Removido dos favoritos',
            isFavorite ? 'heart' : 'heart-outline',
            isFavorite ? 'success' : 'medium'
          );
        }
      },
      error: (error) => {
        console.error('Erro ao alternar favorito:', error);
        this.presentToast('Erro ao atualizar favoritos', 'alert-circle-outline', 'danger');
      }
    });
  }

  openHome() {
    this.router.navigate(['/home']);
  }

  async openMovieDetails(movieId?: number, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (movieId) {
      // Limpa o trailer atual antes de navegar
      this.clearTrailer();
      
      // Navega usando navigateByUrl com replaceUrl: true para evitar acúmulo de histórico
      await this.router.navigateByUrl(`/movie/${movieId}`, { replaceUrl: true });
      
      // Força o recarregamento do componente
      this.ngOnDestroy();
      this.ngOnInit();
    }
  }
  
  // Carrega os vídeos do filme
  private loadMovieVideos(movieId: number) {
    this.movieService.getMovieVideos(movieId).subscribe({
      next: (videos) => {
        if (videos && videos.length > 0) {
          // Pega o primeiro trailer disponível
          const trailer = videos[0];
          // Garante que autoplay=0 está presente e rel=0 para evitar vídeos relacionados
          const url = `https://www.youtube.com/embed/${trailer.key}?autoplay=0&rel=0&showinfo=0&modestbranding=1`;
          // Marca a URL como segura
          this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url) as string;
        } else {
          this.trailerUrl = null;
          console.log('Nenhum trailer disponível para este filme');
        }
      },
      error: (error) => {
        console.error('Erro ao carregar vídeos do filme:', error);
        this.trailerUrl = null;
      }
    });
  }
  
  // Alterna a exibição do trailer
  toggleTrailer() {
    this.showTrailer = !this.showTrailer;
    
    // Se estiver escondendo o trailer, pausa o vídeo sem limpar a URL
    if (!this.showTrailer && this.youtubeIframe?.nativeElement) {
      const iframe = this.youtubeIframe.nativeElement;
      // Pausa o vídeo definindo a URL para a mesma URL, mas com autoplay=0
      if (iframe.src.includes('autoplay=1')) {
        iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0');
      }
    }
  }

  // Limpa o trailer atual (usado apenas ao sair da página)
  private clearTrailer() {
    // Esconde o trailer
    this.showTrailer = false;
    
    // Pausa o vídeo se estiver tocando
    if (this.youtubeIframe?.nativeElement) {
      const iframe = this.youtubeIframe.nativeElement;
      if (iframe.src.includes('autoplay=1')) {
        iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0');
      }
    }
  }
}
