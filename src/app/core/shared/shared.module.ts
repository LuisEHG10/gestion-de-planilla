import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


import { NotFoundComponent } from './components/not-found/not-found.component';
import { MaterialModule } from './material.module';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/public/login/services/auth.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';


@NgModule({
  imports: [
    HttpClientModule,
    RouterModule,
    MaterialModule,
    CommonModule
  ],
  declarations: [
    NotFoundComponent,
    NavbarComponent,
    SidebarComponent
  ],
  exports: [
    HttpClientModule,
    RouterModule,
    NotFoundComponent,
    MaterialModule,
    CommonModule,
    NavbarComponent,
    SidebarComponent
  ],
  providers: [AuthService]
})

export class SharedModule {
  constructor() {}
}
