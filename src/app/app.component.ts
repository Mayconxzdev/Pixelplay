import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { close, mail, logoGoogle, logIn, personCircle, heart, personAdd } from 'ionicons/icons';

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
  constructor() {
    addIcons({ 
      close, 
      mail, 
      logoGoogle, 
      logIn,
      personCircle,
      heart,
      personAdd
    });
  }
}
