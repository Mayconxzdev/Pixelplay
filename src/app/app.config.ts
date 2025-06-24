import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule, Storage } from '@ionic/storage-angular'; // Adicionado Storage aqui
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';
import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { ThemeService } from './core/services/theme.service';

import { routes } from './app.routes';

// Cria uma instância do Storage para ser usada em toda a aplicação
const storage = new Storage();

console.log('Configuring app providers...');

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: Storage,
      useValue: storage
    },
    {
      provide: ThemeService,
      useFactory: (storage: Storage) => {
        console.log('Creating ThemeService instance...');
        return new ThemeService(storage);
      },
      deps: [Storage]
    },
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
    provideFirebaseApp(() => {
      console.log('Initializing Firebase...');
      return initializeApp(environment.firebase);
    }),
    provideAuth(() => {
      console.log('Initializing Auth...');
      return getAuth();
    }),
    provideFirestore(() => {
      console.log('Initializing Firestore...');
      return getFirestore();
    })
  ]
};
