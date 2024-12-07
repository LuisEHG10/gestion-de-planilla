import { NgModule } from "@angular/core";
import { PublicRoutingModule } from "./public-routing.module";
import { SharedModule } from "../core/shared/shared.module";
import { PublicComponent } from "./public.component";
import { LoginComponent } from './login/containers/login.component';
import { AuthService } from "./login/services/auth.service";
import { LoginGuard } from "../core/guards/login.guard";
import { ReactiveFormsModule } from "@angular/forms";
import { DialogRecoverComponent } from "./login/dialog-recover/dialog-recover.component";
import { DialogSendEmailComponent } from "./login/dialog-send-email/dialog-send-email.component";
import { ResetPasswordComponent } from "./login/reset-password/reset-password.component";

@NgModule({
    imports: [
        PublicRoutingModule,
        SharedModule,
        ReactiveFormsModule
        
    ],
    declarations: [
        PublicComponent,
        LoginComponent,
        DialogRecoverComponent,
        DialogSendEmailComponent,
        ResetPasswordComponent
    ],
    exports: [],
    providers: [
        AuthService,
        LoginGuard
    ]
})

export class PublicModule {
    constructor() { }
}
