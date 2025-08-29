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
    console.group('ThemeService.setTheme()');
    console.log('Setting theme to:', theme);
    
    try {
      // Atualiza o tema atual imediatamente
      this.currentTheme = theme;
      console.log('Current theme updated to:', this.currentTheme);
      
      const ionApp = document.querySelector('ion-app');
      if (!ionApp) {
        throw new Error('ion-app element not found');
      }
      
      // Determina se o tema é escuro
      const isDark = theme === 'dark' || (theme === 'system' && this.prefersDark.matches);
      console.log('Theme will be:', isDark ? 'dark' : 'light');
      
      // Aplica as classes CSS
      if (isDark) {
        ionApp.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        ionApp.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
      
      // Força uma atualização de layout para garantir que as mudanças sejam aplicadas
      document.body.offsetHeight;
      
      // Notifica os assinantes sobre a mudança de tema
      console.log('Notifying subscribers about theme change');
      this.themeChangeSubject.next(isDark);
      
      // Salva a preferência no storage (não bloqueia a UI)
      if (this.storageInitialized) {
        this.storage.set(this.THEME_KEY, theme)
          .then(() => console.log('Theme preference saved to storage'))
          .catch(err => console.error('Error saving theme to storage:', err));
      }
      
      return isDark;
    } catch (error) {
      console.error('Error in setTheme:', error);
      throw error;
    } finally {
      console.groupEnd();
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
    const nextTheme = this.currentTheme === 'light' ? 'dark' : 
                     this.currentTheme === 'dark' ? 'system' : 'light';
    
    await this.setTheme(nextTheme);
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
