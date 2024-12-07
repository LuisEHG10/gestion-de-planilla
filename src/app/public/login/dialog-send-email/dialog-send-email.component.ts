import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-send-email',
  templateUrl: './dialog-send-email.component.html',
  styleUrls: ['./dialog-send-email.component.scss']
})
export class DialogSendEmailComponent implements OnInit{

  titulo!: string;
  subtitulo!: string;

  constructor(
    public dialogRef: MatDialogRef<DialogSendEmailComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      correo: string;
      emailIsValid: boolean;
      mensaje: string;
      parentDialogRef: MatDialogRef<any>; // Recibe la referencia del diálogo padre
    }
  ) {
    console.log('emailIsValid: ' + data.emailIsValid)
    if(this.data.emailIsValid === true){
      this.titulo = 'Activaci&oacute;n';
      this.subtitulo = data.mensaje;
    }else{
      this.titulo = 'Error';
      this.subtitulo = data.mensaje;
    }

  }

  ngOnInit(): void {
  }


  cerrarDialogo(): void {
    this.dialogRef.close('Resultado del diálogo'); // Puedes pasar datos de vuelta al componente padre
  }

  alertSucess() {
    Swal.fire({
      title: '¡Se envió con éxito!',
      icon: 'success',
      showConfirmButton: false, // Oculta el botón de confirmación
      timer: 2000, // Cierra el diálogo después de 2000 ms (2 segundos)
    }).then(() => {
      // Cierra el diálogo de Angular después de que SweetAlert se cierre
      this.dialogRef.close('Cambios guardados');
    });
  }

  alertError() {
    Swal.fire({
      title: '¡Error!',
      text: 'Ocurrió un error al guardar los datos. Por favor, inténtalo de nuevo.',
      icon: 'error',
      showConfirmButton: false, // Oculta el botón de confirmación
      timer: 2000, // Cierra el diálogo después de 3000 ms (3 segundos)
    }).then(() => {
      // Cierra el diálogo de Angular después de que SweetAlert se cierre
      this.dialogRef.close('Error al guardar');
    });
  }

  closeModal(){
    this.data.parentDialogRef.close(); // Cierra el diálogo padre
    this.dialogRef.close(); // Cierra el diálogo actual
  }
}
