// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // API Configuration
  tmdbApiKey: 'b19482533361f027dec14391eb35d74d', // TMDB API key
  tmdbApiUrl: 'https://api.themoviedb.org/3',
  tmdbImageUrl: 'https://image.tmdb.org/t/p',
  
  // App Configuration
  appName: 'PixelPlay',
  defaultLanguage: 'pt-BR',
  defaultPageSize: 20,
  
  // Firebase Configuration
  firebase: {
    apiKey: "AIzaSyDXsuz7ci10-ynTofLP1u6AqlucjLziwdA",
    authDomain: "pixelplay-5bc50.firebaseapp.com",
    projectId: "pixelplay-5bc50",
    storageBucket: "pixelplay-5bc50.firebasestorage.app",
    messagingSenderId: "789800619171",
    appId: "1:789800619171:web:c930cdd789996f372a0316"
  },
  
  // Feature Flags
  enableAnalytics: false,
  enableErrorLogging: true
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
