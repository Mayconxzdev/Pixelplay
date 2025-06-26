import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastController, IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegisterPage } from '../register/register.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private modalInstance: ModalController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Verifica se há parâmetros passados para o modal
    this.modalInstance.getTop().then(modal => {
      if (modal && modal.componentProps) {
        const { email } = modal.componentProps as { email?: string };
        if (email) {
          this.loginForm.patchValue({ email });
        }
      }
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.login(email, password);
        
        // Fecha o modal antes de navegar
        await this.modalCtrl.dismiss();
        
        // Navega para a página inicial
        this.router.navigate(['/tabs/home']);
      } catch (error: any) {
        let errorMessage = 'Erro ao fazer login. Tente novamente.';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          errorMessage = 'Email ou senha inválidos.';
        }
        this.presentToast(errorMessage);
      } finally {
        this.isLoading = false;
      }
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }

  async openRegister() {
    // Fecha o modal de login
    this.modalCtrl.dismiss();
    
    // Abre o modal de registro
    const modal = await this.modalCtrl.create({
      component: RegisterPage,
      cssClass: 'auto-height',
      backdropDismiss: true
    });
    
    await modal.present();
  }
}