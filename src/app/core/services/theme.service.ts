import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';

type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'user_theme_preference';
  private prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  private currentTheme: ThemeMode = 'system';

  private themeChangeSubject = new BehaviorSubject<boolean>(false);

  private storageInitialized = false;

  constructor(private storage: Storage) {
    console.log('ThemeService constructor called');
    
    // Inicializa o storage e carrega o tema
    this.initializeStorage();
    
    // Atualiza os observadores quando o tema do sistema mudar
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.currentTheme === 'system') {
        this.setSystemTheme();
        this.themeChangeSubject.next(this.isDarkMode());
      }
    });
  }
  
  private async initializeStorage() {
    try {
      console.log('Initializing storage...');
      await this.storage.create();
      this.storageInitialized = true;
      console.log('Storage initialized');
      await this.loadTheme();
    } catch (error) {
      console.error('Error initializing storage:', error);
      // Tenta continuar mesmo com erro no storage
      this.storageInitialized = false;
      await this.setSystemTheme();
    }
  }

  async init() {
    console.log('ThemeService.init() called');
    if (!this.storageInitialized) {
      await this.initializeStorage();
    } else {
      await this.loadTheme();
    }
  }

  private async loadTheme() {
    try {
      console.log('Loading theme from storage...');
      const savedTheme = await this.storage.get(this.THEME_KEY);
      console.log('Saved theme from storage:', savedTheme);
      
      if (savedTheme) {
        console.log('Setting saved theme:', savedTheme);
        await this.setTheme(savedTheme as ThemeMode);
      } else {
        console.log('No saved theme, using system theme');
        await this.setSystemTheme();
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      // Fallback para o tema do sistema em caso de erro
      await this.setSystemTheme();
    }
  }

  async setTheme(theme: ThemeMode) {
    console.log('ThemeService: Setting theme to', theme);
    this.currentTheme = theme;
    const ionApp = document.querySelector('ion-app');
    
    if (!ionApp) {
      console.error('ThemeService: ion-app element not found');
      return;
    }
    
    let isDark = false;
    
    switch (theme) {
      case 'light':
        console.log('ThemeService: Applying light theme');
        ionApp.classList.remove('dark');
        isDark = false;
        break;
        
      case 'dark':
        console.log('ThemeService: Applying dark theme');
        ionApp.classList.add('dark');
        isDark = true;
        break;
        
      case 'system':
      default:
        console.log('ThemeService: Applying system theme');
        isDark = this.setSystemTheme();
        break;
    }
    
    // Notifica os assinantes sobre a mudança de tema
    console.log('ThemeService: Notifying subscribers about theme change:', isDark ? 'dark' : 'light');
    this.themeChangeSubject.next(isDark);
    
    // Salva a preferência no storage
    try {
      await this.storage.set(this.THEME_KEY, theme);
      console.log('ThemeService: Theme preference saved to storage:', theme);
    } catch (error) {
      console.error('ThemeService: Error saving theme to storage:', error);
    }
  }

  private setSystemTheme(): boolean {
    const ionApp = document.querySelector('ion-app');
    if (!ionApp) {
      console.error('ThemeService: ion-app element not found in setSystemTheme');
      return false;
    }
    
    const isDark = this.prefersDark.matches;
    console.log('ThemeService: System prefers dark mode?', isDark);
    
    if (isDark) {
      ionApp.classList.add('dark');
    } else {
      ionApp.classList.remove('dark');
    }
    
    return isDark;
  }

  getCurrentTheme(): ThemeMode {
    return this.currentTheme;
  }

  async toggleTheme() {
    console.log('toggleTheme called');
    try {
      const current = await this.storage.get(this.THEME_KEY) || 'system';
      console.log('Current theme from storage:', current);
      
      if (current === 'system') {
        console.log('Switching to dark theme');
        await this.setTheme('dark');
      } else if (current === 'dark') {
        console.log('Switching to light theme');
        await this.setTheme('light');
      } else {
        console.log('Switching to system theme');
        await this.setTheme('system');
      }
    } catch (error) {
      console.error('Error in toggleTheme:', error);
    }
  }

  isDarkMode(): boolean {
    const ionApp = document.querySelector('ion-app');
    if (!ionApp) {
      console.error('ThemeService: ion-app element not found in isDarkMode');
      return false;
    }
    
    const isDark = ionApp.classList.contains('dark');
    console.log('ThemeService: isDarkMode() =', isDark);
    return isDark;
  }

  // Permite que os componentes se inscrevam nas mudanças de tema
  onThemeChange(): Observable<boolean> {
    return this.themeChangeSubject.asObservable();
  }
}
