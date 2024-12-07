import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  token: string = '';
  loading: boolean = false;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadTokenFromUrl();
    this.enableRealTimeValidation();
  }

  /** Inicializa el formulario */
  private initializeForm(): void {
    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  /** Obtiene el token desde la URL */
  private loadTokenFromUrl(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  /** Habilita la validación en tiempo real */
  private enableRealTimeValidation(): void {
    this.resetForm.valueChanges.subscribe(() => {
      this.resetForm.updateValueAndValidity({ emitEvent: false });
    });
  }

  /** Validador para comprobar que las contraseñas coinciden */
  private passwordMatchValidator(group: FormGroup): any {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  /** Getter para controles del formulario */
  get f() {
    return this.resetForm.controls;
  }

  /** Verifica si las contraseñas no coinciden */
  private passwordsDoNotMatch(): boolean {
    const password = this.resetForm.get('password')?.value;
    const confirmPassword = this.resetForm.get('confirmPassword')?.value;
    return password !== confirmPassword;
  }

  /** Maneja el envío del formulario */
  onSubmit(): void {
    this.submitted = true;

    if (this.passwordsDoNotMatch()) {
      this.showError('Las contraseñas no coinciden.');
      return;
    }

    if (this.resetForm.invalid) return;

    this.loading = true;
    const newPassword = this.resetForm.value.password;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (res) => this.handleSuccess(res),
      error: (err) => this.handleError(err),
    });
  }

  /** Muestra mensajes de éxito */
  private handleSuccess(response: any): void {
    this.loading = false;
    Swal.fire({
      title: '¡Contraseña restablecida!',
      text: response.mensajeRespuesta || 'Tu contraseña ha sido actualizada.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
    }).then(() => this.router.navigate(['/']));
  }

  /** Muestra mensajes de error */
  private handleError(error: any): void {
    this.loading = false;
    Swal.fire({
      title: 'Error',
      text: error?.error?.mensajeRespuesta || 'Hubo un problema al restablecer tu contraseña.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }

  /** Muestra un mensaje de error personalizado */
  private showError(message: string): void {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }
}
