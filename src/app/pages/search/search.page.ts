import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonSearchbar, IonInfiniteScroll, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MovieService } from 'src/app/core/services/movie.service';
import { GenreService } from 'src/app/core/services/genre.service';
import { Movie } from '../../shared/models/movie.model';
import { Genre } from '../../shared/models/genre.model';
import { Subject } from 'rxjs';
import { takeUntil, catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class SearchPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  @ViewChild('searchInput', { static: true }) searchInput!: IonSearchbar;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll | undefined;
  
  searchQuery: string = '';
  searchResults: Movie[] = [];
  suggestedSearches: string[] = [
    'Ação', 'Aventura', 'Comédia', 'Drama', 'Terror', 'Ficção Científica',
    'Vingadores', 'Batman', 'Star Wars', 'Harry Potter', 'O Poderoso Chefão'
  ];
  popularGenres: Genre[] = [];
  genres: Genre[] = [];
  isLoading: boolean = false;
  currentPage: number = 1;
  totalPages: number = 1;
  totalResults: number = 0;
  isSearchingByGenre: boolean = false;
  currentGenreId: number | null = null;

  constructor(
    private movieService: MovieService,
    private genreService: GenreService,
    private toastCtrl: ToastController
  ) { 
    // Carrega os gêneros populares
    this.loadPopularGenres();
  }

  ngOnInit() {
    // Carrega todos os gêneros
    this.genreService.getGenres()
      .pipe(takeUntil(this.destroy$))
      .subscribe(genres => {
        this.genres = genres;
      });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // Carrega os gêneros populares
  private loadPopularGenres() {
    this.popularGenres = [
      { id: 28, name: 'Ação' },
      { id: 12, name: 'Aventura' },
      { id: 35, name: 'Comédia' },
      { id: 18, name: 'Drama' },
      { id: 27, name: 'Terror' },
      { id: 878, name: 'Ficção Científica' },
      { id: 16, name: 'Animação' },
      { id: 10749, name: 'Romance' }
    ];
  }
  
  // Verifica se um termo de busca é um gênero
  isGenre(term: string): boolean {
    return this.genres.some(genre => 
      genre.name.toLowerCase() === term.toLowerCase()
    );
  }
  
  // Busca por um gênero específico
  searchByGenre(genre: Genre) {
    this.searchQuery = genre.name;
    this.isSearchingByGenre = true;
    this.currentGenreId = genre.id;
    this.performSearch(genre.name, 1, true);
  }
  
  // Manipula o evento de limpar a busca
  onSearchClear() {
    this.searchResults = [];
    this.searchQuery = '';
    this.isSearchingByGenre = false;
    this.currentGenreId = null;
  }

  ionViewWillEnter() {
    this.searchInput.setFocus();
  }

  onSearchChange(event: any) {
    const query = event.target.value.trim();
    
    if (query.length > 2) {
      this.performSearch(query, 1, false);
    } else {
      this.searchResults = [];
      this.currentPage = 1;
      this.totalPages = 1;
      this.isSearchingByGenre = false;
      this.currentGenreId = null;
    }
  }

  private async performSearch(query: string, page: number, isGenreSearch: boolean = false) {
    try {
      if (page === 1) {
        this.searchResults = [];
        this.isLoading = true;
      }
      
      // Se for uma busca por gênero
      if (isGenreSearch && this.currentGenreId) {
        this.movieService.getMoviesByGenre(this.currentGenreId, page)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => this.handleSearchResponse(response, page),
            error: (error) => this.handleSearchError(error, 'Erro ao buscar filmes por gênero')
          });
      } 
      // Se for uma busca normal, verifica se o termo é um gênero
      else {
        const genre = this.genres.find(g => 
          g.name.toLowerCase() === query.toLowerCase()
        );
        
        if (genre) {
          this.isSearchingByGenre = true;
          this.currentGenreId = genre.id;
          this.movieService.getMoviesByGenre(genre.id, page)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => this.handleSearchResponse(response, page),
              error: (error) => this.handleSearchError(error, 'Erro ao buscar filmes por gênero')
            });
        } else {
          this.isSearchingByGenre = false;
          this.currentGenreId = null;
          this.movieService.searchMovies(query, page)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => this.handleSearchResponse(response, page),
              error: (error) => this.handleSearchError(error, 'Erro ao buscar filmes')
            });
        }
      }
    } catch (error) {
      this.handleSearchError(error, 'Erro na busca');
    }
  }
  
  // Manipula a resposta da busca
  private handleSearchResponse(response: any, page: number) {
    if (page === 1) {
      this.searchResults = [];
    }
    
    this.searchResults = [...this.searchResults, ...(response.results || [])];
    this.currentPage = page;
    this.totalPages = response.total_pages || 1;
    this.totalResults = response.total_results || 0;
    this.isLoading = false;
    
    // Completa o infinite scroll se estiver ativo
    if (this.infiniteScroll) {
      this.infiniteScroll.complete();
      
      // Desativa o infinite scroll se não houver mais páginas
      if (this.currentPage >= this.totalPages) {
        this.infiniteScroll.disabled = true;
      }
    }
    
    // Se não houver resultados, exibe mensagem
    if (this.searchResults.length === 0) {
      this.presentToast('Nenhum resultado encontrado', 'warning');
    }
  }
  
  // Manipula erros na busca
  private handleSearchError(error: any, message: string) {
    console.error(`${message}:`, error);
    this.isLoading = false;
    this.presentToast(message);
    
    if (this.infiniteScroll) {
      this.infiniteScroll.complete();
    }
  }

  // Carrega mais resultados ao rolar
  loadMore(event: any) {
    if (this.currentPage < this.totalPages && !this.isLoading) {
      this.currentPage++;
      this.performSearch(this.searchQuery, this.currentPage, this.isSearchingByGenre);
    } else {
      event.target.complete();
      event.target.disabled = true;
    }
  }
  
  // Define o termo de busca e inicia a pesquisa
  setSearchTerm(term: string) {
    this.searchQuery = term;
    this.performSearch(term, 1, this.isGenre(term));
  }
  
  // Manipula erros de carregamento de imagem
  onImageError(event: any) {
    event.target.src = 'assets/images/no-poster.jpg';
  }

  // Limpa a busca
  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
    this.currentPage = 1;
    this.totalPages = 1;
    this.isSearchingByGenre = false;
    this.currentGenreId = null;
    
    // Foca no campo de busca
    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.setFocus();
      }
    }, 100);
  }

  getPosterUrl(posterPath: string | null): string {
    if (!posterPath) {
      return 'assets/images/no-poster.jpg';
    }
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  }

  // Funções auxiliares para trackBy
  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }

  trackByTerm(index: number, term: string): string {
    return term;
  }

  trackByGenre(index: number, genre: Genre): number {
    return genre.id;
  }

  trackByGenreId(index: number, genreId: number): number {
    return genreId;
  }

  // Obtém o nome de um gênero pelo ID
  getGenreName(genreId: number): string {
    if (!this.genres || !this.genres.length) return '';
    const genre = this.genres.find(g => g.id === genreId);
    return genre ? genre.name : '';
  }

  private async presentToast(
    message: string, 
    color: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark' = 'dark'
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
      buttons: [
        {
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }
}
