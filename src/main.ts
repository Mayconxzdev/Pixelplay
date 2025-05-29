import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app/app.routes';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

// Serviços
import { ApiService } from './app/core/services/api.service';
import { StorageService } from './app/core/services/storage.service';
import { MovieService } from './app/core/services/movie.service';
import { GenreService } from './app/core/services/genre.service';
import { FeaturedService } from './app/core/services/featured.service';

// Configuração da aplicação
import appConfig from './app/app.config';

registerLocaleData(localePt);

// Adiciona os provedores específicos do main.ts ao appConfig
const mainProviders = [
  { provide: LOCALE_ID, useValue: 'pt' },
  provideRouter(routes, withComponentInputBinding()),
  // Provedores de serviços
  ApiService,
  StorageService,
  MovieService,
  GenreService,
  FeaturedService,

];

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    ...mainProviders
  ]
} as any).catch(err => console.error('Erro ao iniciar a aplicação:', err));
