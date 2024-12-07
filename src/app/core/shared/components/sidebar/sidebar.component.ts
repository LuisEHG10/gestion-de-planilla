import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/public/login/services/auth.service';
import { UserService } from '../../../../admin/services/user.service';
import { EventEmitterService } from '../../services/event-emitter.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{

  showMenu: boolean = false; // Controla la visibilidad del menú desplegable
  correo: string = ""
  token: any;
  imagenSeleccionada: string | ArrayBuffer | null = null;
  rolUser: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    public eventEmitterService: EventEmitterService
  ) {

    this.eventEmitterService.getRol().subscribe((rol: number) => {
      this.rolUser = rol; //convierto a false
      console.log('RolUser', this.rolUser)
    });

    this.token = this.authService.obtenerToken();

    if(this.token!=null){
      this.traerImagenCliente(this.token);
    }
    this.eventEmitterService.localStorageUpdate$.subscribe((key: string) => {
      if(key==='token'){
        this.token = this.authService.obtenerToken();
        this.traerImagenCliente(this.token);
      }
    });
  }
  ngOnInit(): void {
     // Comprobar si existe un rol guardado en localStorage
    const storedRol = localStorage.getItem('rolUser');
    if (storedRol) {
    this.rolUser = parseInt(storedRol);
    }
  }

  // Cierra sesión y redirige al login
  logout(): void {
    // Eliminar el token del sessionStorage
    sessionStorage.removeItem('token'); // Eliminar token de sessionStorage
    localStorage.removeItem('rolUser'); // Eliminar rol

    // Redirigir al usuario a la página de login
    this.router.navigate(['/login-registro']);
  }

  traerImagenCliente(token: any) {
    if (token != null) {
      this.userService
        .getImageUser(token.imagen)
        .subscribe((response) => {
          const reader = new FileReader();
          reader.onload = () => {
            this.imagenSeleccionada = reader.result;
          };
          reader.readAsDataURL(response);
        });
    }
  }

  verPerfil(){
    this.router.navigate(['/admin/ver-perfil']);
  }

}