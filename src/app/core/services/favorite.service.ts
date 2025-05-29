import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Movie } from '../../shared/models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly FAVORITES_KEY = 'favorites';

  constructor(private storageService: StorageService) {}

  async getFavorites(): Promise<Movie[]> {
    return (await this.storageService.get(this.FAVORITES_KEY)) || [];
  }

  async addFavorite(movie: Movie): Promise<void> {
    const favorites = await this.getFavorites();
    if (!favorites.some(fav => fav.id === movie.id)) {
      favorites.push(movie);
      await this.storageService.set(this.FAVORITES_KEY, favorites);
    }
  }

  async removeFavorite(movieId: number): Promise<void> {
    const favorites = await this.getFavorites();
    const updatedFavorites = favorites.filter(movie => movie.id !== movieId);
    await this.storageService.set(this.FAVORITES_KEY, updatedFavorites);
  }

  async isFavorite(movieId: number): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.some(movie => movie.id === movieId);
  }

  async toggleFavorite(movie: Movie): Promise<boolean> {
    const isFav = await this.isFavorite(movie.id);
    if (isFav) {
      await this.removeFavorite(movie.id);
      return false;
    } else {
      await this.addFavorite(movie);
      return true;
    }
  }
}
