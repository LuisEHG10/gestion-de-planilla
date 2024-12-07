import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { PayrollService } from '../services/payroll.service';

@Component({
  selector: 'app-gestion-carga',
  templateUrl: './gestion-carga.component.html',
  styleUrls: ['./gestion-carga.component.scss']
})
export class GestionCargaComponent {

  @ViewChild('fileInput') fileInput: any; // Referencia al input de archivo

  constructor(
    public dialog: MatDialog,
    private payrollService: PayrollService
  ) {}

  archivoSeleccionado: File | null = null;
  fileResult: string | ArrayBuffer | null = null;
  fileContent: string = '';


  onChangeFile(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.archivoSeleccionado = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.fileResult = reader.result;
      };
      reader.readAsText(file);
      console.log('FILE_TXT: ',file)

    }
  }

  abrirDialogo(): void {
    
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '60%', // Ancho del diálogo
      data: { 
        archivoSeleccionado: this.archivoSeleccionado // Envía el archivo seleccionado al diálogo
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.clearFile();
      console.log('El diálogo fue cerrado');
      console.log('Resultado: ', result);
    });
  }

  uploadFile() {
    if (this.archivoSeleccionado) {
      this.payrollService.createPayroll(this.archivoSeleccionado).subscribe(
        response => {
          console.log('Archivo enviado con éxito:', response);
        },
        error => {
          console.error('Error al enviar el archivo:', error);
        }
      );
    } else {
      console.warn('No hay archivo seleccionado.');
    }
  }

  clearFile(): void {
    this.archivoSeleccionado = null;
    this.fileResult = null;
    this.fileContent = '';  // Limpiamos el contenido almacenado
    console.log('Archivo y contenido limpiados');

    // Limpiar el input de tipo file
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''; // Resetea el campo de entrada
    }
  }


}
