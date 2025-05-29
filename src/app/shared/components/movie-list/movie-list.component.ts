import { Component, Input, Output, EventEmitter, OnInit, TrackByFunction } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Movie } from '../../../shared/models/movie.model';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    DateFormatPipe
  ]
})
export class MovieListComponent implements OnInit {
  @Input() movies: Movie[] = [];
  @Input() title: string = '';
  @Input() showViewAll: boolean = false;
  @Input() viewAllRoute: string = '';
  @Input() trackBy: TrackByFunction<Movie> = (index: number, movie: Movie) => movie?.id;
  @Output() favoriteToggled = new EventEmitter<{movie: Movie, isFavorite: boolean}>();
  @Output() movieSelected = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {}

  onFavoriteClick(event: Event, movie: Movie): void {
    event.stopPropagation();
    
    // Atualiza o estado local imediatamente para feedback visual
    const movieIndex = this.movies.findIndex(m => m.id === movie.id);
    if (movieIndex !== -1) {
      this.movies = [
        ...this.movies.slice(0, movieIndex),
        { ...this.movies[movieIndex], isFavorite: !this.movies[movieIndex].isFavorite },
        ...this.movies.slice(movieIndex + 1)
      ];
    }
    
    // Emite o evento para o componente pai
    this.favoriteToggled.emit({
      movie: { ...movie, isFavorite: !movie.isFavorite },
      isFavorite: !movie.isFavorite
    });
  }

  onMovieClick(movieId: number): void {
    this.movieSelected.emit(movieId);
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
