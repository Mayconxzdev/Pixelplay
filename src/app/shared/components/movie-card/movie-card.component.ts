import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Movie } from '../../models/movie.model';
import { environment } from '../../../../environments/environment';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { GenresPipe } from '../../pipes/genres.pipe';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonicModule
  ]
})
export class MovieCardComponent {
  @Input() movie!: Movie; // Usando o operador de não-nulo para evitar erros de inicialização
  @Input() showFavoriteButton: boolean = true;
  @Output() favoriteToggled = new EventEmitter<{movie: Movie, isFavorite: boolean}>();

  constructor(private router: Router) {}

  get posterImage(): string {
    return this.movie.poster_path 
      ? `${environment.tmdbImageUrl}/w500${this.movie.poster_path}`
      : 'assets/images/no-poster.jpg';
  }

  get ratingColor(): string {
    const rating = this.movie.vote_average * 10;
    if (rating >= 70) return 'success';
    if (rating >= 50) return 'warning';
    return 'danger';
  }

  get ratingPercentage(): number {
    return Math.round(this.movie.vote_average * 10);
  }

  onFavoriteClick(event: Event) {
    event.stopPropagation();
    this.favoriteToggled.emit({
      movie: this.movie,
      isFavorite: !this.movie.isFavorite
    });
  }

  openMovieDetails() {
    this.router.navigate(['/movie', this.movie.id]);
  }
}
