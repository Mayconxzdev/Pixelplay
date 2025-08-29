import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Platform } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { 
  close, 
  mail, 
  logoGoogle,
  logIn,
  personCircle,
  heart,
  personAdd,
  informationCircleOutline,
  sunny,
  moon,
  heartOutline,
  playCircleOutline,
  playCircle,
  peopleOutline,
  personCircleOutline,
  alertCircleOutline,
  arrowBack,
  chevronBack,
  chevronForward,
  star,
  starOutline,
  timeOutline,
  calendarOutline,
  languageOutline,
  cashOutline,
  peopleCircleOutline,
  closeCircleOutline
} from 'ionicons/icons';
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
    
    // Inicializa o tema de forma assíncrona
    const initializeTheme = async () => {
      try {
        // Aguarda o storage estar pronto
        await this.themeService.init();
        
        // Obtém o tema atual do serviço (já carregado no init)
        const currentTheme = this.themeService.getCurrentTheme();
        console.log('AppComponent: Current theme:', currentTheme);
        
        // Aplica o tema
        await this.themeService.setTheme(currentTheme);
        console.log('AppComponent: Theme initialized to:', currentTheme);
      } catch (error) {
        console.error('AppComponent: Error initializing theme:', error);
        // Fallback para o tema do sistema
        try {
          await this.themeService.setTheme('system');
          console.log('AppComponent: Fallback to system theme');
        } catch (fallbackError) {
          console.error('AppComponent: Failed to set system theme:', fallbackError);
        }
      }
    };
    
    // Executa a inicialização do tema
    initializeTheme().catch(console.error);
    
    // Register all icons
    addIcons({
      'close': close,
      'mail': mail,
      'logo-google': logoGoogle,
      'log-in': logIn,
      'person-circle': personCircle,
      'heart': heart,
      'person-add': personAdd,
      'information-circle-outline': informationCircleOutline,
      'sunny': sunny,
      'moon': moon,
      'heart-outline': heartOutline,
      'play-circle-outline': playCircleOutline,
      'play-circle': playCircle,
      'people-outline': peopleOutline,
      'person-circle-outline': personCircleOutline,
      'alert-circle-outline': alertCircleOutline,
      'arrow-back': arrowBack,
      'chevron-back': chevronBack,
      'chevron-forward': chevronForward,
      'star': star,
      'star-outline': starOutline,
      'time-outline': timeOutline,
      'calendar-outline': calendarOutline,
      'language-outline': languageOutline,
      'cash-outline': cashOutline,
      'people-circle-outline': peopleCircleOutline,
      'close-circle-outline': closeCircleOutline
    });
    
    console.log('✅ Ícones registrados com sucesso!');
  }
}
