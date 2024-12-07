import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModulesComponent } from './modules.component';
import { GestionCargaComponent } from './gestion-carga/gestion-carga.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { CalculadorIndividualComponent } from './calculador-individual/calculador-individual.component';
import { GestionReportesComponent } from './gestion-reportes/gestion-reportes.component';
import { VerPerfilComponent } from './ver-perfil/ver-perfil.component';

const routes: Routes = [
  {
      path: '', component: ModulesComponent, children:
      [
          { path: '', redirectTo: 'tecnicos', pathMatch: 'full' },
          { path: 'gestion-carga', component: GestionCargaComponent }, //PENDIENTE GUARDS PARA TECNICO 1
          { path: 'calculador-individual', component: CalculadorIndividualComponent },
          { path: 'gestion-reportes', component: GestionReportesComponent},
          { path: 'ver-perfil', component: VerPerfilComponent }
      ]
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
],
exports: [
    RouterModule
]
})
export class ModulesRoutingModule { }
