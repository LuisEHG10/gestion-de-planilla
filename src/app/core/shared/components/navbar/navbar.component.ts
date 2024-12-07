import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from '../../services/event-emitter.service';
import { AuthService } from 'src/app/public/login/services/auth.service';
import Swal from 'sweetalert2';
import { UserService } from '../../../../admin/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  // template: `    <div class="logo">
  //                 <span>FORO UTP</span>
  //                 </div>
  //          `,
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  showMenu: boolean = false;
  pintar: number = 0;
  ruta: string = '';
  rolAdmin: boolean = false;
  imagenSeleccionada: string | ArrayBuffer | null = null; // Imagen de perfil
  token: any = null; // Token de autenticación

  // Rutas específicas del administrador
  private readonly rutasAdmin: string[] = ['/doctores', '/citas'];

  constructor(
    private router: Router,
    private eventEmitterService: EventEmitterService,
    private authService: AuthService,
    private userService: UserService
  ) {
    // Obtener token desde el AuthService
    this.token = this.authService.obtenerToken();

    // Verificar si el token existe para obtener la imagen de perfil
    if (this.token && this.token.imagen) {
      this.traerImagenCliente(this.token);
    }

    // Escuchar cambios en el token
    this.eventEmitterService.localStorageUpdate$.subscribe((key: string) => {
      if (key === 'token') {
        this.token = this.authService.obtenerToken();
        if (this.token?.imagen) {
          this.traerImagenCliente(this.token);
        }
      }
    });
  }

  ngOnInit(): void {}

  // Función para obtener la imagen de perfil
  traerImagenCliente(token: any) {
    if (token && token.imagen) {
      this.userService.getImageUser(token.imagen).subscribe((response) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagenSeleccionada = reader.result;
        };
        reader.readAsDataURL(response);
      });
    }
  }

  // Función para cerrar sesión
  logout(): void {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login-registro']);
      // Resetear las variables que contienen la imagen y el email
  this.token = null;
  this.imagenSeleccionada = null;

  // Redirigir al usuario a la página de login
  this.router.navigate(['/login-registro']);
  }
}
