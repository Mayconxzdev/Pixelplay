import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs-routing.module').then(m => m.TabsRoutingModule)
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then(m => m.SearchPageModule),
    data: { title: 'Buscar' }
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./pages/movie-details/movie-details.page').then(m => m.MovieDetailsPage),
    data: { title: 'Detalhes do Filme' }
  },
  {
    path: 'movies/popular',
    loadComponent: () => import('./pages/movie-list').then(m => m.MovieListPage),
    data: { title: 'Filmes Populares', listType: 'popular' }
  },
  {
    path: 'movies/upcoming',
    loadComponent: () => import('./pages/movie-list').then(m => m.MovieListPage),
    data: { title: 'Próximos Lançamentos', listType: 'upcoming' }
  },
  {
    path: 'movies/top_rated',
    loadComponent: () => import('./pages/movie-list').then(m => m.MovieListPage),
    data: { title: 'Melhores Avaliados', listType: 'top_rated' }
  },
  {
    path: 'movies/genre/:id',
    loadComponent: () => import('./pages/genre-movies/genre-movies.page').then(m => m.GenreMoviesPage),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.page').then(m => m.AboutPage),
    data: { title: 'Sobre Nós' }
  },
  {
    path: '**',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  }
];
