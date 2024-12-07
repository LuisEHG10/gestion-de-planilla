import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PublicComponent } from "./public.component";
import { LoginComponent } from "./login/containers/login.component";
import { LoginGuard } from "../core/guards/login.guard";
import { NotFoundComponent } from "../core/shared/components/not-found/not-found.component";
import { ResetPasswordComponent } from "./login/reset-password/reset-password.component";

const routes: Routes = [
    {
        path: '', component: PublicComponent, children:
        [
            { path: '', redirectTo: 'login-registro', pathMatch: 'full' },
            { path: 'login-registro', component: LoginComponent, canActivate:[LoginGuard]},
            { path: 'notfound', component: NotFoundComponent },
            { path: 'reset-password', component: ResetPasswordComponent }
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

export class PublicRoutingModule {
    constructor() {}
}
