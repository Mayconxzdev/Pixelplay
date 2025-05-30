import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app/app.routes';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { addIcons } from 'ionicons';
import {
  heartOutline, star, starOutline, film, flame, calendar, informationCircle, chevronForwardOutline,
  closeCircle, search, trashOutline, timeOutline, pricetag, arrowBack
} from 'ionicons/icons';

// Serviços
import { ApiService } from './app/core/services/api.service';
import { StorageService } from './app/core/services/storage.service';
import { MovieService } from './app/core/services/movie.service';
import { GenreService } from './app/core/services/genre.service';
import { FeaturedService } from './app/core/services/featured.service';

// Configuração da aplicação
import appConfig from './app/app.config';

registerLocaleData(localePt);

addIcons({
  'heart-outline': heartOutline,
  'star': star,
  'star-outline': starOutline,
  'film': film,
  'flame': flame,
  'calendar': calendar,
  'information-circle': informationCircle,
  'chevron-forward-outline': chevronForwardOutline,
  'close-circle': closeCircle,
  'search': search,
  'trash-outline': trashOutline,
  'time-outline': timeOutline,
  'pricetag': pricetag,
  'arrow-back': arrowBack
});

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
