import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular/standalone';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { addIcons } from 'ionicons';
import {
  heartOutline, star, starOutline, film, filmOutline, flame, calendar, informationCircle, chevronForwardOutline,
  closeCircle, search, trashOutline, timeOutline, pricetag, arrowBack, close, logIn, logoGoogle, personAdd,
  warningOutline, heart, sadOutline, refresh, refreshOutline, arrowUp, alertCircleOutline, calendarOutline,
  languageOutline, videocamOffOutline, personCircle, informationCircleOutline, heartDislikeOutline
} from 'ionicons/icons';

// Serviços
import { ApiService } from './app/core/services/api.service';
import { StorageService } from './app/core/services/storage.service';
import { MovieService } from './app/core/services/movie.service';
import { GenreService } from './app/core/services/genre.service';
import { FeaturedService } from './app/core/services/featured.service';

// Configurações da aplicação
import { appConfig } from './app/app.config';

if (environment.production) {
  enableProdMode();
}

// Configuração do locale para português
registerLocaleData(localePt);

// Registra os ícones usados na aplicação
addIcons({
  // Ícones básicos
  'heart': heart,
  'heart-outline': heartOutline,
  'heart-dislike-outline': heartDislikeOutline,
  'star': star,
  'star-outline': starOutline,
  'film': film,
  'film-outline': filmOutline,
  'flame': flame,
  'calendar': calendar,
  'calendar-outline': calendarOutline,
  'information-circle': informationCircle,
  'information-circle-outline': informationCircleOutline,
  'chevron-forward': chevronForwardOutline,
  'chevron-forward-outline': chevronForwardOutline,
  'close': close,
  'close-circle': closeCircle,
  'search': search,
  'search-outline': search,
  'trash-outline': trashOutline,
  'time-outline': timeOutline,
  'pricetag': pricetag,
  'arrow-back': arrowBack,
  'arrow-up': arrowUp,
  'refresh': refresh,
  'refresh-outline': refreshOutline,
  'sad-outline': sadOutline,
  'warning-outline': warningOutline,
  'alert-circle-outline': alertCircleOutline,
  'language-outline': languageOutline,
  'videocam-off-outline': videocamOffOutline,
  'person-circle': personCircle,
  'log-in': logIn,
  'logo-google': logoGoogle,
  'person-add': personAdd
});

// Provedores específicos do main.ts
const mainProviders = [
  { provide: LOCALE_ID, useValue: 'pt' },
  { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  // Serviços da aplicação
  ApiService,
  StorageService,
  MovieService,
  GenreService,
  FeaturedService
];

// Combina as configurações do appConfig com os provedores específicos do main.ts
bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    ...mainProviders
  ]
} as any).catch(err => console.error('Erro ao iniciar a aplicação:', err));
