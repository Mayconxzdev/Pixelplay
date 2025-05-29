import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Movie, MovieDetails, ApiResponse } from '../../shared/models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiKey = environment.tmdbApiKey;
  private readonly baseUrl = environment.tmdbApiUrl;

  private readonly authParams = {
    api_key: this.apiKey,
    language: 'pt-BR'
  };

  constructor(private http: HttpClient) {}

  private getParams(customParams: any = {}) {
    return { params: { ...this.authParams, ...customParams } };
  }

  getPopularMovies(page: number = 1): Observable<ApiResponse<Movie>> {
    return this.http.get<ApiResponse<Movie>>(
      `${this.baseUrl}/movie/popular`,
      this.getParams({ page })
    );
  }

  getMovieDetails(id: number): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(
      `${this.baseUrl}/movie/${id}`,
      this.getParams({ append_to_response: 'videos,images,similar,credits' })
    );
  }

  searchMovies(query: string, page: number = 1): Observable<ApiResponse<Movie>> {
    return this.http.get<ApiResponse<Movie>>(
      `${this.baseUrl}/search/movie`,
      this.getParams({ query, page })
    );
  }

  /**
   * Obtém os filmes mais bem avaliados
   * @param page Página atual
   * @returns Observable com a lista de filmes
   */
  getTopRatedMovies(page: number = 1): Observable<ApiResponse<Movie>> {
    return this.http.get<ApiResponse<Movie>>(
      `${this.baseUrl}/movie/top_rated`,
      this.getParams({ page })
    );
  }

  /**
   * Obtém os próximos lançamentos
   * @param page Página atual
   * @returns Observable com a lista de filmes
   */
  getUpcomingMovies(page: number = 1): Observable<ApiResponse<Movie>> {
    return this.http.get<ApiResponse<Movie>>(
      `${this.baseUrl}/movie/upcoming?api_key=${this.apiKey}&page=${page}&language=pt-BR`
    );
  }

  /**
   * Obtém os créditos de um filme (elenco e equipe)
   * @param id ID do filme
   * @returns Observable com os créditos do filme
   */
  getMovieCredits(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/movie/${id}/credits?api_key=${this.apiKey}&language=pt-BR`
    );
  }

  /**
   * Obtém filmes similares
   * @param id ID do filme
   * @param page Página atual
   * @returns Observable com a lista de filmes similares
   */
  getSimilarMovies(id: number, page: number = 1): Observable<ApiResponse<Movie>> {
    return this.http.get<ApiResponse<Movie>>(
      `${this.baseUrl}/movie/${id}/similar?api_key=${this.apiKey}&page=${page}&language=pt-BR`
    );
  }

  /**
   * Obtém as imagens de um filme (pôsteres, pano de fundo, etc.)
   * @param id ID do filme
   * @returns Observable com as imagens do filme
   */
  getMovieImages(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/movie/${id}/images?api_key=${this.apiKey}&include_image_language=pt,en,null`
    );
  }

  /**
   * Obtém os vídeos de um filme (trailers, teasers, etc.)
   * @param id ID do filme
   * @returns Observable com os vídeos do filme
   */
  getMovieVideos(id: number): Observable<{ id: number; results: any[] }> {
    return this.http.get<{ id: number; results: any[] }>(
      `${this.baseUrl}/movie/${id}/videos`,
      this.getParams({})
    );
  }

  /**
   * Obtém filmes por gênero
   * @param genreId ID do gênero
   * @param page Número da página
   * @returns Observable com a lista de filmes do gênero
   */
  getMoviesByGenre(genreId: number, page: number = 1): Observable<ApiResponse<Movie>> {
    return this.http.get<ApiResponse<Movie>>(
      `${this.baseUrl}/discover/movie`,
      this.getParams({
        with_genres: genreId.toString(),
        sort_by: 'popularity.desc',
        page: page.toString()
      })
    );
  }
}
