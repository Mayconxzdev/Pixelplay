import { Pipe, PipeTransform, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Genre, GenreService } from '../../core/services/genre.service';

@Pipe({
  name: 'genres',
  standalone: true
})
export class GenresPipe implements PipeTransform {
  private genreService = inject(GenreService);

  transform(genreIds: number[] | null | undefined, limit: number = 0): Observable<string> {
    if (!genreIds || genreIds.length === 0) {
      return of('');
    }

    return this.genreService.getGenres$().pipe(
      map((genres: Genre[]) => {
        const genreNames = genreIds
          .map(id => genres.find((g: Genre) => g.id === id)?.name || '')
          .filter((name: string) => name !== '');

        if (limit > 0 && genreNames.length > limit) {
          return `${genreNames.slice(0, limit).join(', ')} +${genreNames.length - limit}`;
        }

        return genreNames.join(', ');
      })
    );
  }
}
