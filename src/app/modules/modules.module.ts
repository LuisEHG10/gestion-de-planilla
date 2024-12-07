import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulesRoutingModule } from './modules-routing.module';
import { ModulesComponent } from './modules.component';
import { GestionCargaComponent } from './gestion-carga/gestion-carga.component';
import { CalculadorIndividualComponent } from './calculador-individual/calculador-individual.component';
import { SharedModule } from '../core/shared/shared.module';
import { GestionReportesComponent } from './gestion-reportes/gestion-reportes.component';
import { DialogComponent } from './dialog/dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { PayrollService } from './services/payroll.service';
import { VerPerfilComponent } from './ver-perfil/ver-perfil.component';
import { CalculadorService } from './services/calculador.service';


@NgModule({
  declarations: [
    ModulesComponent,
    GestionCargaComponent,
    CalculadorIndividualComponent,
    GestionReportesComponent,
    DialogComponent,
    VerPerfilComponent,
  ],
  imports: [
    CommonModule,
    ModulesRoutingModule,
    SharedModule,
    ReactiveFormsModule, // Asegúrate de que esto esté aquí
    FormsModule // Asegúrate de agregar FormsModule en los imports
  ],
  providers: [
    PayrollService,
    CalculadorService
  ]
})
export class ModulesModule { }
