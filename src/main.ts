import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
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

if (environment.production) {
  enableProdMode();
}

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
  { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  provideRouter(routes),
  provideHttpClient(),
  provideIonicAngular(),
  importProvidersFrom(IonicStorageModule.forRoot()),
  provideStore({}),
  provideEffects([]),
  provideStoreDevtools({
    maxAge: 25,
    logOnly: !isDevMode(),
    autoPause: true,
    trace: false,
    traceLimit: 75
  }),
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideAuth(() => getAuth()),
  provideFirestore(() => getFirestore()),
  // Provedores de serviços
  ApiService,
  StorageService,
  MovieService,
  GenreService,
  FeaturedService,
];

bootstrapApplication(AppComponent, {
  providers: [
    ...mainProviders
  ]
} as any).catch(err => console.error('Erro ao iniciar a aplicação:', err));
