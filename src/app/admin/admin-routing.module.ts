import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";

import { AuthGuard } from "../core/guards/auth.guard";
import { ListarTecnicoComponent } from "./listar-tecnico/listar-tecnico.component";
import { VerPerfilComponent } from "../modules/ver-perfil/ver-perfil.component";


const routes: Routes = [
    {
        path: '', component: AdminComponent, children:
        [
            { path: '', redirectTo: 'admin', pathMatch: 'full' },
            { path: 'listar-tecnicos', component: ListarTecnicoComponent, canActivate:[AuthGuard] },
            { path: 'ver-perfil', component: VerPerfilComponent, canActivate:[AuthGuard] }
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

export class AdminRoutingModule {
    constructor() {}
}
