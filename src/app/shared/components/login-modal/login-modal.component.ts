import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalController, IonicModule } from '@ionic/angular';
import { AuthService, AuthError } from '@app/core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule]
})
export class LoginModalComponent {
  private authService = inject(AuthService);
  private modalCtrl = inject(ModalController);
  private fb = inject(FormBuilder);

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        await this.authService.login(
          this.loginForm.value.email,
          this.loginForm.value.password
        );
        this.dismiss();
      } catch (error) {
        const authError = error as AuthError;
        this.errorMessage = this.getErrorMessage(authError.code);
      }
    }
  }

  private getErrorMessage(code: string): string {
    switch(code) {
      case 'user-not-found':
      case 'invalid-credential':
        return 'Email ou senha incorretos';
      case 'wrong-password':
        return 'Senha incorreta';
      case 'too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde.';
      default:
        return 'Erro ao fazer login. Tente novamente.';
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
