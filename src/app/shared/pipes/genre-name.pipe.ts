import { Pipe, PipeTransform, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { GenreService } from '../../core/services/genre.service';

@Pipe({
  name: 'genreName',
  standalone: true
})
export class GenreNamePipe implements PipeTransform {
  private genreService = inject(GenreService);

  transform(genreId: number): Observable<string> {
    if (!genreId) {
      return of('');
    }

    return this.genreService.getGenres$().pipe(
      map((genres) => {
        const genre = genres.find((g) => g.id === genreId);
        return genre ? genre.name : '';
      })
    );
  }
}
