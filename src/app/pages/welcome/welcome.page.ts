import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, NavController, IonicModule } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { RegisterPage } from '../register/register.page';

@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.page.html',
  styleUrls: ['welcome.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class WelcomePage {
  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) {}

  async openLogin() {
    const modal = await this.modalCtrl.create({
      component: LoginPage,
      cssClass: 'auto-height',
      backdropDismiss: true
    });
    await modal.present();
  }

  async openRegister() {
    const modal = await this.modalCtrl.create({
      component: RegisterPage,
      cssClass: 'auto-height',
      backdropDismiss: true
    });
    await modal.present();
  }

  continueAsGuest() {
    this.navCtrl.navigateRoot('/tabs');
  }
}
