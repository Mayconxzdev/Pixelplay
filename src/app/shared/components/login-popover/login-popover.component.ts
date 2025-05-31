import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { RegisterModalComponent } from '../register-modal/register-modal.component'; // Adicione essa linha

@Component({
  selector: 'app-login-popover',
  templateUrl: './login-popover.component.html',
  styleUrls: ['./login-popover.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonicModule
  ]
})
export class LoginPopoverComponent {
  constructor(private popoverCtrl: PopoverController, private modalCtrl: ModalController) {}

  async login(method: 'email' | 'google') {
    if (method === 'email') {
      const modal = await this.modalCtrl.create({
        component: LoginModalComponent,
        cssClass: 'centered-modal',
        backdropDismiss: false
      });
      await modal.present();
    }
    this.dismiss();
  }

  async register() {
    const modal = await this.modalCtrl.create({
      component: RegisterModalComponent,
      cssClass: 'centered-modal',
      backdropDismiss: false
    });
    await modal.present();
    this.dismiss();
  }

  dismiss() {
    this.popoverCtrl.dismiss();
  }
}
