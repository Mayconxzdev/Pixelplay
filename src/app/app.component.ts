import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';

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
  constructor() {}
}
