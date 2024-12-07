import { NgModule } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatDialogModule} from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from 'src/app/public/login/services/auth.service';
import { MatListModule } from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { UserService } from '../../admin/services/user.service';


@NgModule({
  imports: [
    MatTabsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatTableModule,
    MatPaginatorModule,
    MatRadioModule,
    MatDialogModule,
    MatTooltipModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatTabsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatRadioModule,
    MatDialogModule,
    MatTooltipModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
  providers:[
    AuthService,
    UserService
  ]
})

export class MaterialModule {
  constructor() {}
}
