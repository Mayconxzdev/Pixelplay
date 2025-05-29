import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Genre } from '../../models/movie.model';
import { GenreService } from '../../../core/services/genre.service';

interface Category {
  id: string;
  name: string;
  icon: string;
  type: 'genre' | 'category';
  params?: any;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [
    { id: 'popular', name: 'Populares', icon: 'flame', type: 'category' },
    { id: 'top_rated', name: 'Melhores Avaliados', icon: 'star', type: 'category' },
    { id: 'upcoming', name: 'Próximos Lançamentos', icon: 'calendar', type: 'category' }
  ];
  
  genres: Genre[] = [];
  isLoading = true;

  constructor(
    private genreService: GenreService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('CategoriesComponent initialized');
    this.loadGenres();
  }

  private loadGenres() {
    console.log('Loading genres...');
    this.isLoading = true;
    
    const subscription = this.genreService.getGenres().subscribe({
      next: (genres) => {
        console.log('Genres received in component:', genres);
        this.genres = genres;
        this.isLoading = false;
        console.log('Genres loaded, isLoading:', this.isLoading);
      },
      error: (error) => {
        console.error('Error loading genres in component:', error);
        this.isLoading = false;
        console.log('Error loading genres, isLoading:', this.isLoading);
      },
      complete: () => {
        console.log('Genre subscription completed');
        subscription.unsubscribe();
      }
    });
  }

  onCategoryClick(category: Category | { id: string; name: string; type: 'genre' | 'category' }) {
    if (category.type === 'genre') {
      this.router.navigate(['/movies/genre', category.id]);
    } else {
      this.router.navigate(['/movies', category.id]);
    }
  }
}
