import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Genre } from '../../shared/models/movie.model';
import { GenreService } from '../../core/services/genre.service';
import { Subscription } from 'rxjs';

interface Category {
  id: string;
  name: string;
  icon: string;
  type: 'category' | 'genre';
  params?: any;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categories: Category[] = [
    {
      id: 'popular',
      name: 'Populares',
      icon: 'flame',
      type: 'category',
      params: { type: 'popular' }
    },
    {
      id: 'top_rated',
      name: 'Melhores Avaliados',
      icon: 'star',
      type: 'category',
      params: { type: 'top_rated' }
    },
    {
      id: 'upcoming',
      name: 'Em Breve',
      icon: 'calendar',
      type: 'category',
      params: { type: 'upcoming' }
    }
  ];
  
  genres: Genre[] = [];
  isLoading = true;
  error: string | null = null;
  private subscriptions = new Subscription();

  constructor(
    private genreService: GenreService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadGenres();
  }

  private loadGenres() {
    this.isLoading = true;
    const genresSub = this.genreService.getGenres().subscribe({
      next: (genres) => {
        this.genres = genres;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading genres:', error);
        this.error = 'Erro ao carregar gêneros. Tente novamente mais tarde.';
        this.isLoading = false;
      }
    });
    this.subscriptions.add(genresSub);
  }

  onCategoryClick(category: Category) {
    if (category.type === 'category') {
      this.router.navigate(['/tabs/movies'], { 
        queryParams: category.params 
      });
    }
  }

  onGenreClick(genre: Genre) {
    this.router.navigate(['/genre', genre.id], {
      state: { genreName: genre.name }
    });
  }

  getGenreIcon(genreName: string): string {
    // Mapeia nomes de gêneros para ícones
    const iconMap: { [key: string]: string } = {
      'Ação': 'flash',
      'Aventura': 'airplane',
      'Animação': 'color-wand',
      'Comédia': 'happy',
      'Crime': 'alert',
      'Documentário': 'document',
      'Drama': 'sad',
      'Família': 'people',
      'Fantasia': 'sparkles',
      'História': 'book',
      'Terror': 'skull',
      'Música': 'musical-notes',
      'Mistério': 'search',
      'Romance': 'heart',
      'Ficção científica': 'rocket',
      'Cinema TV': 'film',
      'Thriller': 'alert-circle',
      'Guerra': 'shield',
      'Faroeste': 'sunny'
    };

    return iconMap[genreName] || 'ellipse';
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
