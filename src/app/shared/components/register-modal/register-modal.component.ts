import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalController, IonicModule } from '@ionic/angular';
import { AuthService, AuthError } from '@app/core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule]
})
export class RegisterModalComponent {
  private authService = inject(AuthService);
  private modalCtrl = inject(ModalController);
  private fb = inject(FormBuilder);

  registerForm: FormGroup;
  errorMessage: string = '';

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      try {
        await this.authService.register(
          this.registerForm.value.email,
          this.registerForm.value.password,
          this.registerForm.value.name
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
      case 'email-already-in-use':
        return 'Este email já está em uso';
      case 'invalid-email':
        return 'Email inválido';
      case 'weak-password':
        return 'Senha muito fraca (mínimo 6 caracteres)';
      default:
        return 'Erro ao registrar. Tente novamente.';
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
