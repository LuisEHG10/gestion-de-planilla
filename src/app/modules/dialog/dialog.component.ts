import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { PayrollService } from '../services/payroll.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {

  loading: boolean = false; // Variable para manejar el estado de carga
  tipoPlanilla!: string;
  mes!: string;
  anio!: string;

  archivoSeleccionado: File | null = null; // Propiedad para almacenar el archivo

  constructor(
    private payrollService: PayrollService,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      archivoSeleccionado: File | null; // Añade archivoSeleccionado en los datos
    }
  ) {
    this.archivoSeleccionado = data.archivoSeleccionado;
  }

  ngOnInit(): void {
    let mes: string = '';
    let tipoPlanilla: string = '';
    let anio: string = '';

    if (this.archivoSeleccionado) {
      this.payrollService.getPeriodoAndTipoPayroll(this.archivoSeleccionado).subscribe({
        next: (resp) => {
          this.anio = resp.anio;
          this.mes = resp.mes;
          this.tipoPlanilla = resp.tipoPlanilla;
        },
        error: (err) => {
          console.log('err: ', err);
        }
      });
    }else{
      console.warn('No hay archivo seleccionado.');
    }
  }

  cerrarDialogo(): void {
    this.dialogRef.close('Resultado del diálogo'); // Puedes pasar datos de vuelta al componente padre
  }

  saveFile() {
    if (this.archivoSeleccionado) {
      this.loading = true;

      this.payrollService.createPayroll(this.archivoSeleccionado).subscribe({
        next: (resp) => {

          if(resp.code == '0'){
            this.loading = false; // Oculta el indicador de carga
            this.alertSucess();
            console.log('Archivo enviado con éxito:', resp);
          }else{
            this.loading = false; 
            this.alertError(resp.message);
            console.error('Error al enviar el archivo:', resp);
          }

        },
        error: (err) => {
          this.loading = false; // Oculta el indicador de carga
          this.alertError(err.message);
          console.error('Error al enviar el archivo:', err);
        }
      });
    } else {
      console.warn('No hay archivo seleccionado.');
    }
  }

  alertSucess() {
    Swal.fire({
      title: '¡Se guardó con éxito!',
      icon: 'success',
      showConfirmButton: false, // Oculta el botón de confirmación
      timer: 2000, // Cierra el diálogo después de 2000 ms (2 segundos)
    }).then(() => {
      // Cierra el diálogo de Angular después de que SweetAlert se cierre
      this.dialogRef.close('Cambios guardados');
    });
  }

  alertError(message: string) {
    Swal.fire({
      title: '¡Error!',
      text: message,
      icon: 'error',
      showConfirmButton: false, // Oculta el botón de confirmación
      timer: 2000, // Cierra el diálogo después de 3000 ms (3 segundos)
    }).then(() => {
      // Cierra el diálogo de Angular después de que SweetAlert se cierre
      this.dialogRef.close('Error al guardar');
    });
  }

}
