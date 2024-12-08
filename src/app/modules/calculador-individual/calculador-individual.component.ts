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

  btnPaso: string = 'Editar';
  currentYear!: number;
  nombresApellidos?: string;
  totalAnual: number = 0
  displayedColumns: string[] = ['periodo', 'conceptosFijos', 'bonificaciones', 'otrasEntidades', 'reintegros', 'totalMensual'];
  displayedColumns1: string[] = ['periodo', 'deduccion', 'importe'];
  displayedColumns2: string[] = ['rangos', 'importe', 'tasa', 'irqc'];
  displayedColumns3: string[] = ['periodo', 'descuento', 'situacion'];
  dataSource: any[] = [];
  dataSource1: any[] = [];
  dataSource2: any[] = [];
  dataSource3: any[] = [];
  paso: number = 1;
  
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

  ngOnInit(): void {
    this.dataSource1 = [
      { periodo: '2025', deduccion: '36,050.00', importe: '65,000.00' }
    ];

    this.dataSource2 = [
      { rangos: 'Hasta 5 UIT', importe: 'S/. -51.00', tasa: '8%', irqc: '4.08' },
      { rangos: 'Más de 5 UIT hasta 20 UIT', importe: 'S/ .00', tasa: '14%', irqc: '-' },
      { rangos: 'Más de 20 UIT hasta 35 UIT', importe: 'S/. 00', tasa: '17%', irqc: '-' },
      { rangos: 'Más de 35 UIT hasta 45 UIT', importe: 'S/. 00', tasa: '20%', irqc: '-' },
      { rangos: 'Más de 45 UIT', importe: 'S/. 00', tasa: '30%', irqc: '-' },
      { rangos: 'TOTAL ANUAL DE IMPUESTO DE RENTA DE QUINTA CATEGORÍA (IRQC)', importe: '', tasa: '', irqc: '4.08' }
    ];
    

    this.dataSource3 = [
      { periodo: 'Ene-24', descuento: '', situacion: 'Ejecutado' },
      { periodo: 'Feb-24', descuento: '', situacion: 'Ejecutado' },
      { periodo: 'Mar-24', descuento: '', situacion: 'Ejecutado' },
      { periodo: 'Abr-24', descuento: '', situacion: 'Ejecutado' },
      { periodo: 'May-24', descuento: '', situacion: 'Ejecutado' },
      { periodo: 'Jun-24', descuento: '', situacion: 'Ejecutado' },
      { periodo: 'Jul-24', descuento: '', situacion: 'Ejecutado' },
      { periodo: 'Ago-24', descuento: '', situacion: 'Ejecutado' },
      { periodo: 'Sep-24', descuento: '', situacion: 'Ejecutado' },
      { periodo: 'Oct-24', descuento: '', situacion: 'Ejecutado' },
      { periodo: 'Nov-24', descuento: '', situacion: 'Ejecutado' },
      { periodo: 'Dic-24', descuento: '', situacion: 'Ejecutado' },
      { periodo: 'TOTAL', descuento: '', situacion: 'Monto Recalculado' }
    ];
    
  }

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
    if(this.btnPaso === 'Editar'){
      this.editMode = !this.editMode;
      this.totalAnual = 0;
      for(let item of this.dataSource){
        item.totalPagar = parseInt(item.bonificaciones) + parseInt(item.conceptosFijos) + parseInt(item.reintegros) + (parseInt(item.otrasEntidades) || 0);
        this.totalAnual += item.totalPagar;
      }
    }else if(this.btnPaso === 'Regresar'){
      this.btnPaso = 'Editar';
        this.paso = 1;
    }

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
  
  next(){
    this.paso = 2;
    this.btnPaso = 'Regresar';
  }

}
