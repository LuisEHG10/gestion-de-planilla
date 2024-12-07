import { Component, OnInit } from '@angular/core';

interface ReportItem {
  label: string;
}

@Component({
  selector: 'app-gestion-reportes',
  templateUrl: './gestion-reportes.component.html',
  styleUrls: ['./gestion-reportes.component.scss']
})
export class GestionReportesComponent implements OnInit{
  reportItems: ReportItem[] = [
    { label: 'Reporte para carga masiva' },
    { label: 'Reporte de calculo de 5ta Cat.' },
    { label: 'Reporte de cargas Realizadas' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  addReport(): void {
    console.log('Añadir nuevo reporte');
  }

  exportToExcel(): void {
    console.log('Exportar a Excel');
  }
}