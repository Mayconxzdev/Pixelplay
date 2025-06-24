import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { close, mail, logoGoogle, logIn, personCircle, heart, personAdd, informationCircleOutline, sunny, moon } from 'ionicons/icons';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <router-outlet></router-outlet>
    </ion-app>
  `,
  standalone: true,
  imports: [
    CommonModule, 
    IonicModule, 
    RouterOutlet
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  private themeService = inject(ThemeService);
  
  constructor() {
    console.log('AppComponent constructor');
    
    // Força a aplicação do tema ao iniciar
    try {
      const currentTheme = this.themeService.getCurrentTheme();
      console.log('AppComponent: Current theme:', currentTheme);
      this.themeService.setTheme(currentTheme).catch(error => {
        console.error('AppComponent: Error applying theme:', error);
        // Usa o tema do sistema como fallback em caso de erro
        this.themeService.setTheme('system').catch(console.error);
      });
    } catch (error) {
      console.error('AppComponent: Error getting current theme:', error);
      // Usa o tema do sistema como fallback
      this.themeService.setTheme('system').catch(console.error);
    }
    
    // Registra os ícones
    addIcons({ 
      close, 
      mail, 
      logoGoogle, 
      logIn,
      personCircle,
      heart,
      personAdd,
      informationCircleOutline,
      sunny,
      moon
    });
  }
}
