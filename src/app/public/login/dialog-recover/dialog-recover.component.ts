import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DialogSendEmailComponent } from '../dialog-send-email/dialog-send-email.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dialog-recover',
  templateUrl: './dialog-recover.component.html',
  styleUrls: ['./dialog-recover.component.scss'],
})
export class DialogRecoverComponent implements OnInit {
  form!: FormGroup;
  contraseniaIncorrecta: boolean = false;
  emailIsValid: boolean = false;
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogRecoverComponent>,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      tipoPlanilla: string;
      mes: string;
      anio: string;
      archivoSeleccionado: File | null; // Añade archivoSeleccionado en los datos
    }
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      correo: ['', [Validators.email, Validators.required]],
    });
  }

  validFormName(val: string): boolean {
    let esInvalido = false;
    if (this.form.get(val)?.invalid && this.form.get(val)?.touched) {
      esInvalido = true;
    }
    return esInvalido;
  }

  validHasError(val: string): number {
    let error = 0;
    if (this.form.get(val)?.hasError('required')) {
      error = 1;
    }
    if (this.form.get(val)?.hasError('email')) {
      error = 2;
    }
    return error;
  }

  cerrarDialogo(): void {
    this.dialogRef.close('Resultado del diálogo'); // Puedes pasar datos de vuelta al componente padre
  }

  closeModal() {
    this.dialogRef.close();
  }

  sendEmail() {

    this.loading = true;

    const correoIngresado = this.form.get('correo')?.value;

    this.authService.forgotPassword(correoIngresado).subscribe({
      next: (response) => {
        console.log("RESPONSE: ", response);
        const dialogRef = this.dialog.open(DialogSendEmailComponent, {
          width: '500px', // Ancho del diálogo
          disableClose: true,
          data: {
            correo: correoIngresado,
            emailIsValid: true,
            mensaje: response.mensajeRespuesta,
            parentDialogRef: this.dialogRef
          },
        });
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.log("ERROR: ", err);
        const dialogRef = this.dialog.open(DialogSendEmailComponent, {
          width: '500px', // Ancho del diálogo
          disableClose: true,
          data: {
            correo: correoIngresado,
            emailIsValid: false,
            mensaje: err.error.mensajeRespuesta,
            parentDialogRef: this.dialogRef
          },
        });
      }
    });
  }
  
}
