import { Component, OnInit } from '@angular/core';
import { CalculadorService } from '../services/calculador.service';
import { MonthlyData } from 'src/app/core/models/MonthlyData';
import { DataResponse } from 'src/app/core/models/DataResponse';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calculador-individual',
  templateUrl: './calculador-individual.component.html',
  styleUrls: ['./calculador-individual.component.scss']
})
export class CalculadorIndividualComponent implements OnInit {

  currentYear!: number;
  nombresApellidos?: string;
  totalAnual: number = 0
  displayedColumns: string[] = ['periodo', 'conceptosFijos', 'bonificaciones', 'otrasEntidades', 'reintegros', 'totalMensual'];
  dataSource: any[] = [];
  
  // Formulario reactivo
  codigoModularForm: FormGroup;
  editMode: boolean = false; // Estado para controlar la edición

  constructor(
    private calculatorService: CalculadorService,
    private fb: FormBuilder  // Inyectamos FormBuilder
  ) {
    this.currentYear = new Date().getFullYear();

    // Inicializamos el formulario reactivo
    this.codigoModularForm = this.fb.group({
      codigoModular: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]], // Validación del código modular
    });
  }

  ngOnInit(): void {}

  // Método que se ejecuta cuando se hace clic en el botón de buscar
  onSearch(): void {
    this.totalAnual = 0;
    if (this.codigoModularForm.valid) {
      const codigoModular = this.codigoModularForm.value.codigoModular;
      this.calculatorService.getHaberDetails(codigoModular).subscribe({
        next: (response: any) => {
          console.log('responseProyeccion: ', response);
          if (response.code == '0') {
            // Actualizamos los datos de la tabla con la respuesta
            for(let item of response.data){
                item.totalPagar = parseInt(item.bonificaciones) + parseInt(item.conceptosFijos) + parseInt(item.reintegros);
                this.totalAnual += item.totalPagar;
            }
            this.dataSource = response.data;
            this.nombresApellidos = `${response.nombres} ${response.apellidoPaterno} ${response.apellidoMaterno}`;
            console.log('Datos recibidos:', this.dataSource);
          } else {
            console.error('Error en la respuesta del servidor:', response.message);
            this.showErrorAlert(response.message);
          }
        },
        error: (error) => {
          console.error('Error al realizar la solicitud:', error);
          this.showErrorAlert('Error al conectarse al servidor');
        }
      });
    } else {
      this.showErrorAlert('Por favor ingrese un código modular válido');
    }
  }

  // Función para activar o desactivar el modo de edición
  toggleEditMode(): void {
    this.editMode = !this.editMode;
    this.totalAnual = 0;
    for(let item of this.dataSource){
      item.totalPagar = parseInt(item.bonificaciones) + parseInt(item.conceptosFijos) + parseInt(item.reintegros) + (parseInt(item.otrasEntidades) || 0);
      this.totalAnual += item.totalPagar;
    }
  }

  // Función para mostrar alertas de éxito
  private showSuccessAlert(message: string): void {
    Swal.fire({
      title: 'Éxito',
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }

  // Función para mostrar alertas de error
  private showErrorAlert(message: any): void {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }
}
