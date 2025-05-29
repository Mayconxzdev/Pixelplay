import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

type ToastPosition = 'top' | 'bottom' | 'middle';

export interface ToastOptions {
  message: string;
  duration?: number;
  position?: ToastPosition;
  color?: string;
  icon?: string;
  cssClass?: string | string[];
  buttons?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  async presentToast(
    message: string,
    color: string = 'primary',
    duration: number = 3000,
    position: ToastPosition = 'bottom',
    icon?: string
  ) {
    const toast = await this.toastController.create({
      message,
      duration,
      position,
      color,
      icon,
      buttons: [
        {
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await toast.present();
  }

  async showSuccess(message: string, duration: number = 3000) {
    return this.presentToast(message, 'success', duration, 'bottom', 'checkmark-circle');
  }

  async showError(message: string, duration: number = 3000) {
    return this.presentToast(message, 'danger', duration, 'bottom', 'alert-circle');
  }

  async showWarning(message: string, duration: number = 3000) {
    return this.presentToast(message, 'warning', duration, 'bottom', 'warning');
  }

  async showInfo(message: string, duration: number = 3000) {
    return this.presentToast(message, 'tertiary', duration, 'bottom', 'information-circle');
  }
}
