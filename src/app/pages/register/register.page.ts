import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class RegisterPage {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private toastController: ToastController
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      displayName: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (!this.registerForm.valid || this.isLoading) return;
    
    this.isLoading = true;
    const { email, password, displayName } = this.registerForm.value;
    
    try {
      // 1. Faz o registro
      await this.authService.register(email, password, displayName);
      
      // 2. Mostra mensagem de sucesso
      this.presentToast('Conta criada com sucesso!');
      
      // 3. Fecha o modal de registro
      this.modalCtrl.dismiss().catch(e => console.error('Erro ao fechar modal de registro:', e));
      
      // 4. Abre o modal de login em uma nova pilha de eventos
      setTimeout(() => {
        this.modalCtrl.create({
          component: LoginPage,
          cssClass: 'auto-height',
          backdropDismiss: true,
          componentProps: { email }
        }).then(modal => {
          modal.present().catch(e => console.error('Erro ao abrir modal de login:', e));
        }).catch(e => console.error('Erro ao criar modal de login:', e));
      }, 100);
      
    } catch (error: any) {
      console.error('Erro no registro:', error);
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este e-mail já está em uso.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha é muito fraca. Use pelo menos 6 caracteres.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'O endereço de e-mail é inválido.';
      }
      this.presentToast(errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
