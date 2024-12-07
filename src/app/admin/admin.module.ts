import { NgModule } from '@angular/core';
import { SharedModule } from '../core/shared/shared.module';

import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../public/login/services/auth.service';
import { AuthGuard } from '../core/guards/auth.guard';
import { UserService } from './services/user.service';
import { ListarTecnicoComponent } from './listar-tecnico/listar-tecnico.component';

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    AdminComponent,
    ListarTecnicoComponent,
  ],
  exports: [
  ],
  providers: [AuthService,AuthGuard,UserService],
})
export class AdminModule {
  constructor() {}
}