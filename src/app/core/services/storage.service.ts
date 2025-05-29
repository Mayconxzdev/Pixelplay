import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Movie } from '../../shared/models/movie.model';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private readonly FAVORITES_KEY = 'favorites';

  private favoritesSubject = new BehaviorSubject<Movie[]>([]);
  
  constructor(private storage: Storage) {
    this.init();
    this.loadFavorites();
  }
  
  // Adiciona métodos get e set genéricos para compatibilidade
  async get(key: string, defaultValue: any = null): Promise<any> {
    await this.ensureStorageReady();
    const value = await this._storage?.get(key);
    return value !== null && value !== undefined ? value : defaultValue;
  }
  
  async set(key: string, value: any): Promise<void> {
    await this.ensureStorageReady();
    await this._storage?.set(key, value);
    
    // Atualiza o BehaviorSubject se for a chave de favoritos
    if (key === this.FAVORITES_KEY) {
      this.favoritesSubject.next(await this.getFavoritesList());
    }
  }
  
  async remove(key: string): Promise<void> {
    await this.ensureStorageReady();
    await this._storage?.remove(key);
    
    // Atualiza o BehaviorSubject se for a chave de favoritos
    if (key === this.FAVORITES_KEY) {
      this.favoritesSubject.next([]);
    }
  }
  
  async clear(): Promise<void> {
    await this.ensureStorageReady();
    await this._storage?.clear();
    this.favoritesSubject.next([]);
  }
  
  private async ensureStorageReady(): Promise<void> {
    if (!this._storage) {
      await this.init();
    }
  }
  
  private async getFavoritesList(): Promise<Movie[]> {
    return (await this.get(this.FAVORITES_KEY)) || [];
  }
  
  private async loadFavorites() {
    try {
      const favorites = await this.storage.get('favorites') || [];
      this.favoritesSubject.next(favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }

  async init(): Promise<void> {
    if (!this._storage) {
      this._storage = await this.storage.create();
    }
  }

  getFavorites(): Observable<Movie[]> {
    return this.favoritesSubject.asObservable();
  }

  async addToFavorites(movie: Movie): Promise<boolean> {
    try {
      const favorites = await this.storage.get('favorites') || [];
      if (!favorites.some((m: Movie) => m.id === movie.id)) {
        favorites.push(movie);
        await this.storage.set('favorites', favorites);
        this.favoritesSubject.next(favorites);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  }

  async removeFromFavorites(movieId: number): Promise<boolean> {
    try {
      const favorites = await this.storage.get('favorites') || [];
      const newFavorites = favorites.filter((movie: Movie) => movie.id !== movieId);
      await this.storage.set('favorites', newFavorites);
      this.favoritesSubject.next(newFavorites);
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  }

  async isFavorite(movieId: number): Promise<boolean> {
    const favorites = await this.storage.get('favorites') || [];
    return favorites.some((movie: Movie) => movie.id === movieId);
  }
}
