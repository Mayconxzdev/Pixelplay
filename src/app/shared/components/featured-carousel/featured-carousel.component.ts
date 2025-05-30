import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Movie } from '../../models/movie.model';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { StorageService, ToastService, FavoriteService } from '../../../core/services';
import { TruncatePipe } from '../../pipes';

// Importa o Swiper e seus tipos
import { Swiper } from 'swiper';
import { Autoplay, EffectFade } from 'swiper';
import type { SwiperOptions } from 'swiper/types';

// Configura os módulos do Swiper
Swiper.use([Autoplay, EffectFade]);

@Component({
  selector: 'app-featured-carousel',
  templateUrl: './featured-carousel.component.html',
  styleUrls: ['./featured-carousel.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TruncatePipe
  ]
})
export class FeaturedCarouselComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  swiper: any;
  @Input() movies: Movie[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  swiperLoading = true; // Novo estado para indicar carregamento do Swiper
  @Output() movieSelected = new EventEmitter<number>();
  @Output() favoriteToggled = new EventEmitter<Movie>();
  
  favorites: Set<number> = new Set();
  
  currentSlide = 0;
  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    effect: 'fade' as const,
    fadeEffect: {
      crossFade: true
    },
    on: {
      slideChange: () => {
        if (this.swiper) {
          this.currentSlide = this.swiper.realIndex;
          this.cdr.markForCheck();
        }
      },
      // Evento chamado quando o Swiper é inicializado
      init: () => {
        console.log('Swiper inicializado com sucesso');
        this.swiperInitialized = true;
        this.swiperLoading = false;
        this.cdr.markForCheck();
      }
    }
  };

  constructor(
    private storageService: StorageService,
    private favoriteService: FavoriteService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    // Garante que o Swiper está disponível
    if (typeof window !== 'undefined') {
      import('swiper').then(swiperModule => {
        this.initSwiper();
        this.cdr.markForCheck();
      });
    }
  }

  private destroy$ = new Subject<void>();
  private resizeObserver: ResizeObserver | null = null;
  private swiperInitialized = false;
  private resizeThrottleTimeout: any = null;

  ngOnInit() {
    this.loadFavorites();
    this.setupResizeObserver();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Atualiza o Swiper quando os filmes são carregados ou alterados
    if (changes['movies'] && this.movies && this.movies.length > 0) {
      // Se já existe um Swiper, destrói antes de criar outro
      if (this.swiper) {
        if (!this.swiper.destroyed) {
          this.swiper.destroy(true, true);
        }
        this.swiper = null;
      }
      // Inicializa o Swiper novamente
      this.initSwiper();
      // Garante que o loading desapareça
      this.swiperLoading = false;
      this.cdr.markForCheck();
    }
  }

  ngOnDestroy() {
    // Limpa o timeout do resize
    if (this.resizeThrottleTimeout) {
      clearTimeout(this.resizeThrottleTimeout);
      this.resizeThrottleTimeout = null;
    }
    
    // Limpa as subscrições
    this.destroy$.next();
    this.destroy$.complete();
    
    // Limpa o ResizeObserver se existir
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    
    // Limpa a instância do Swiper
    if (this.swiper) {
      if (!this.swiper.destroyed) {
        this.swiper.destroy(true, true);
      }
      this.swiper = null;
    }
    
    // Força a detecção de mudanças
    this.cdr.detach();
  }
  
  private async loadFavorites() {
    try {
      const favorites = (await this.storageService.get('favorites')) || [];
      if (Array.isArray(favorites)) {
        this.favorites = new Set(favorites.map((m: Movie) => m?.id).filter((id): id is number => id !== undefined && id !== null));
      } else {
        this.favorites = new Set();
        console.warn('Formato inválido de favoritos no armazenamento');
      }
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      this.favorites = new Set();
      this.cdr.markForCheck();
    }
  }
  
  isFavorite(movieId: number): boolean {
    return this.favorites.has(movieId);
  }
  
  async toggleFavorite(movie: Movie) {
    if (!movie?.id) {
      console.error('Filme inválido para favoritar:', movie);
      this.toastService.presentToast('Erro: Filme inválido', 'danger');
      return;
    }

    const wasFavorite = this.isFavorite(movie.id);
    
    try {
      if (wasFavorite) {
        await this.favoriteService.removeFavorite(movie.id);
        this.favorites.delete(movie.id);
        this.toastService.presentToast('Removido dos favoritos', 'success');
      } else {
        await this.favoriteService.addFavorite(movie);
        this.favorites.add(movie.id);
        this.toastService.presentToast('Adicionado aos favoritos', 'success');
      }
      
      // Notifica os componentes pais sobre a mudança
      this.favoriteToggled.emit(movie);
      
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      
      // Reverte a mudança visual em caso de erro
      if (wasFavorite) {
        this.favorites.add(movie.id);
      } else {
        this.favorites.delete(movie.id);
      }
      
      this.toastService.presentToast(
        'Não foi possível atualizar os favoritos. Tente novamente.', 
        'danger'
      );
    }
  }
  
  onFavoriteToggled(movie: Movie, event: Event) {
    event.stopPropagation();
    this.toggleFavorite(movie);
  }

  ngAfterViewInit() {
    this.initSwiper();
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver !== 'undefined' && this.swiperContainer?.nativeElement) {
      this.resizeObserver = new ResizeObserver((entries) => {
        if (this.resizeThrottleTimeout) {
          clearTimeout(this.resizeThrottleTimeout);
        }
        
        // Usa um throttle para evitar múltiplas atualizações rápidas
        this.resizeThrottleTimeout = setTimeout(() => {
          if (this.swiper && !this.swiper.destroyed) {
            this.swiper.update();
            this.cdr.markForCheck();
          }
        }, 100);
      });
      
      this.resizeObserver.observe(this.swiperContainer.nativeElement);
    }
  }

  private async initSwiper(retryCount = 0, maxRetries = 3) {
    console.log('Iniciando inicialização do Swiper...');
    console.log('swiperContainer:', this.swiperContainer);
    console.log('swiper já existe:', !!this.swiper);
    
    // Limpa qualquer timeout pendente
    if (this.resizeThrottleTimeout) {
      clearTimeout(this.resizeThrottleTimeout);
      this.resizeThrottleTimeout = null;
    }
    
    if (this.swiperContainer && !this.swiper && typeof window !== 'undefined') {
      // Define o estado de carregamento
      this.swiperLoading = true;
      this.swiperInitialized = false;
      this.cdr.markForCheck();
      
      try {
        console.log('Importando Swiper...');
        
        // Importa dinamicamente o Swiper apenas no navegador
        const { default: Swiper } = await import('swiper');
        console.log('Swiper importado com sucesso:', Swiper);
        
        console.log('Inicializando Swiper com configuração:', this.swiperConfig);
        
        // Configura o Swiper
        this.swiper = new Swiper(this.swiperContainer.nativeElement, this.swiperConfig);
        
        // O evento 'init' definirá swiperInitialized e swiperLoading como true/false
        console.log('Swiper inicialização iniciada...');
        
        // Força uma atualização após a inicialização
        if (this.swiper) {
          console.log('Atualizando Swiper após inicialização...');
          
          // Adiciona um pequeno atraso para garantir que o DOM esteja pronto
          setTimeout(() => {
            try {
              console.log('Atualizando Swiper após timeout...');
              
              if (this.swiper && !this.swiper.destroyed) {
                this.swiper.update();
                console.log('Swiper atualizado');
                
                // Atualiza o Swiper quando os filmes são carregados
                if (this.movies?.length) {
                  console.log('Atualizando Swiper com', this.movies.length, 'filmes');
                  this.swiper.update();
                }
                
                console.log('Detecção de mudanças forçada');
              } else {
                console.warn('Swiper foi destruído durante a inicialização');
                this.swiperLoading = false;
                this.cdr.markForCheck();
              }
            } catch (error) {
              console.error('Erro ao atualizar o Swiper:', error);
              this.swiperLoading = false;
              this.swiperInitialized = false;
              this.cdr.markForCheck();
              
              // Tenta novamente após um atraso em caso de falha
              if (retryCount < maxRetries) {
                console.log(`Tentativa ${retryCount + 1} de ${maxRetries} - Tentando novamente em 2 segundos...`);
                setTimeout(() => {
                  if (!this.swiperInitialized && !this.swiperLoading) {
                    console.log('Tentando reinicializar o Swiper...');
                    this.initSwiper(retryCount + 1, maxRetries);
                  }
                }, 2000);
              } else {
                console.error('Número máximo de tentativas atingido. Não será feita uma nova tentativa.');
              }
            }
          }, 100);
        }
      } catch (error) {
        console.error('Erro ao inicializar o Swiper:', error);
        this.swiperInitialized = false;
        this.swiperLoading = false;
        this.cdr.markForCheck();
        
        // Tenta novamente após um atraso em caso de falha
        if (retryCount < maxRetries) {
          console.log(`Tentativa ${retryCount + 1} de ${maxRetries} - Tentando novamente em 2 segundos...`);
          setTimeout(() => {
            if (!this.swiperInitialized && !this.swiperLoading) {
              console.log('Tentando reinicializar o Swiper...');
              this.initSwiper(retryCount + 1, maxRetries);
            }
          }, 2000);
        } else {
          console.error('Número máximo de tentativas atingido. Não será feita uma nova tentativa.');
        }
      }
    }
  }

  onIndexChange(index: number) {
    this.currentSlide = index;
  }

  getBackdropUrl(path: string | null | undefined): string {
    if (!path) {
      return 'assets/images/no-backdrop.jpg';
    }
    
    try {
      return `${environment.tmdbImageUrl}/w1280${path}`;
    } catch (error) {
      console.error('Erro ao gerar URL do backdrop:', error);
      return 'assets/images/no-backdrop.jpg';
    }
  }

  getPosterUrl(path: string | null | undefined): string {
    if (!path) {
      return 'assets/images/no-poster.jpg';
    }
    
    try {
      return `${environment.tmdbImageUrl}/w500${path}`;
    } catch (error) {
      console.error('Erro ao gerar URL do poster:', error);
      return 'assets/images/no-poster.jpg';
    }
  }

  getVoteAverage(voteAverage: number | undefined): string {
    if (voteAverage === undefined || voteAverage === null) {
      return 'N/A';
    }
    
    try {
      return voteAverage.toFixed(1);
    } catch (error) {
      console.error('Erro ao formatar avaliação:', error);
      return 'N/A';
    }
  }

  getYearFromDate(dateString: string | null | undefined): string {
    if (!dateString) {
      return '';
    }
    
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? '' : date.getFullYear().toString();
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '';
    }
  }
  
  onMovieSelected(movieId: number | undefined, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    
    if (!movieId) {
      console.error('ID do filme não fornecido');
      return;
    }
    
    try {
      this.movieSelected.emit(movieId);
    } catch (error) {
      console.error('Erro ao selecionar filme:', error);
      this.toastService.presentToast('Não foi possível abrir os detalhes do filme', 'danger');
    }
  }
  
  /**
   * Função de rastreamento para melhorar o desempenho do *ngFor
   * @param index Índice do item
   * @param movie Filme atual
   */
  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }

  /**
   * Navega para um slide específico
   * @param index Índice do slide para navegar
   */
  goToSlide(index: number): void {
    if (this.swiper && !this.swiper.destroyed) {
      if (this.swiper.params && this.swiper.params.loop) {
        this.swiper.slideToLoop(index);
      } else {
        this.swiper.slideTo(index);
      }
      this.currentSlide = index;
      this.cdr.markForCheck();
    }
  }

  /**
   * Navega entre os slides usando o teclado
   * @param direction Direção da navegação ('prev' ou 'next')
   * @param event Evento de teclado
   */
  navigateSlide(direction: 'prev' | 'next', event: Event | KeyboardEvent): void {
    event.preventDefault();
    
    if (!this.swiper || this.swiper.destroyed) {
      return;
    }
    
    if (direction === 'prev') {
      this.swiper.slidePrev();
      this.currentSlide = this.currentSlide > 0 ? this.currentSlide - 1 : this.movies.length - 1;
    } else {
      this.swiper.slideNext();
      this.currentSlide = this.currentSlide < this.movies.length - 1 ? this.currentSlide + 1 : 0;
    }
    
    // Atualiza o foco para o slide atual
    this.updateSlideFocus();
    this.cdr.markForCheck();
  }
  
  /**
   * Atualiza o foco para o slide atual
   */
  private updateSlideFocus(): void {
    // Usa um pequeno atraso para garantir que o DOM foi atualizado
    setTimeout(() => {
      const activeSlide = document.querySelector('.swiper-slide[tabindex="0"]') as HTMLElement;
      if (activeSlide) {
        activeSlide.focus({ preventScroll: true });
      }
    }, 100);
  }

  /**
   * Manipulador de eventos de teclado para navegação acessível
   * @param event Evento de teclado
   */
  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        this.navigateSlide('prev', event);
        break;
      case 'ArrowRight':
        this.navigateSlide('next', event);
        break;
      case 'Home':
        event.preventDefault();
        this.goToSlide(0);
        break;
      case 'End':
        event.preventDefault();
        this.goToSlide(this.movies.length - 1);
        break;
      case 'PageUp':
        event.preventDefault();
        this.navigateSlide('prev', event);
        break;
      case 'PageDown':
        event.preventDefault();
        this.navigateSlide('next', event);
        break;
    }
  }
}
