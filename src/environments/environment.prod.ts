export const environment = {
  production: true,
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
  enableAnalytics: true,
  enableErrorLogging: true
};
