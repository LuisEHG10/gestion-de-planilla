import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-tecnico',
  templateUrl: './listar-tecnico.component.html',
  styleUrls: ['./listar-tecnico.component.scss'],
})
export class ListarTecnicoComponent {
  tecnico1!: boolean;
  displayedColumns: string[] = [
    'nombre',
    'apellido_paterno',
    'apellido_materno',
    'dni',
    'fecha_nacimiento',
    'telefono',
    'email',
    'rol',
    'opciones',
  ];

  dataSource: any[] = []; // Almacena los datos obtenidos del servicio.
  myUserId: number | null = null; // Aquí guardamos el ID de nuestro propio usuario.

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getMyUserId(); // Obtener el ID del usuario desde el sessionStorage
    this.loadUsers(); // Cargar los usuarios al inicializar el componente.
  }

  getMyUserId(): void {
    // Obtener el token desde sessionStorage
    const token = sessionStorage.getItem('token');
    if (token) {
      // Decodificar el token (JWT)
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1])); // Decodifica el payload

      // Extraer el id del usuario del payload
      this.myUserId = payload.id; // Usamos el campo 'id' que está en el payload del token
      console.log('MYID: ', this.myUserId);
    } else {
      console.error('Token no encontrado en sessionStorage');
    }
  }

  loadUsers(): void {
    this.userService.listUsers().subscribe({
      next: (resp) => {
        // Convertir el estado a booleano y filtrar al propio usuario
        console.log('Lista tecnicos: ', resp);
        this.dataSource = resp
          .map((user: any) => ({
            ...user,
            estado: user.estado === 'true', // Convierte 'true' o 'false' a booleano
          }))
          .filter((user: any) => {
            return (
              parseInt(user.idUsuario) !== this.myUserId && // Asegura que el usuario logeado no se muestre
              (user.rol === 'Tecnico 1' || user.rol === 'Tecnico 2') && // Filtra solo los usuarios con rol 1 o rol 2
              user.estado === true
            );
          });

        console.log('Usuarios después del filtro: ', this.dataSource);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      },
    });
  }

  eliminarUsuario(usuario: any) {
    Swal.fire({
      title: '¿Desea Eliminar el usuario?',
      text: `Nombre: ${usuario.nombre} ${usuario.apellidoPaterno}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(usuario.idUsuario).subscribe({
          next: (resp: string) => {
            console.log('respuesta eliminar: ', resp);
            this.loadUsers();
          },
          error: (err) => {
            Swal.fire(
              'Error',
              'Ocurrió un error al intentar eliminar el usuario. Intente nuevamente.',
              'error'
            );
            console.error('Error al eliminar usuario:', err);
          },
        });
      }
    });
  }


  cambiarRol(usuario: any) {

    let rolActual: string = (usuario.rol == 'Tecnico 1') ? 'Tecnico 2' : 'Tecnico 1';
    let rolChange: number = (usuario.rol == 'Tecnico 1') ? 3 : 2;

    Swal.fire({
      title: `¿Desea Cambiar a ${rolActual}?`,
      text: `Nombre: ${usuario.nombre} ${usuario.apellidoPaterno}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Cambiar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.changeUser(usuario.idUsuario, rolChange).subscribe({
          next: (resp: string) => {
            console.log('respuesta cambiar rol: ', resp);
            this.loadUsers();
          },
          error: (err) => {
            Swal.fire(
              'Error',
              'Ocurrió un error al intentar eliminar el usuario. Intente nuevamente.',
              'error'
            );
            console.error('Error al eliminar usuario:', err);
          },
        });
      }
    });
  }
}
