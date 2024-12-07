import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/shared/services/event-emitter.service';
import { AuthService } from '../services/auth.service';
import { Usuario } from 'src/app/core/models/Usuario';
import { MatDialog } from '@angular/material/dialog';
import { DialogRecoverComponent } from '../dialog-recover/dialog-recover.component';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/admin/services/user.service';
import { UsuarioRequest } from 'src/app/core/models/UsuarioRequest';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  emailLogin!: FormControl;
  emailRegistro!: FormControl;

  tipo: number = 1;
  titulo: string = 'Iniciar';
  descripcion: string = 'Ingrese';
  nameBtn: string = 'Ingresar';
  imagenFile: File | null = null;
  fecha_nacimiento = '';

  contraseniaIncorrecta: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private eventEmitterService: EventEmitterService,
    private serviceAuth: AuthService,
    private userService: UserService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],

      nombres: ['', Validators.required],
      apellido_paterno: ['', Validators.required],
      apellido_materno: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      dni: ['', Validators.required],
      telefono: ['', Validators.required],
      imagen: [''],
    });

  }

  validFormName(val: string): boolean {
    let esInvalido = false;
    if (this.form.get(val)?.invalid && this.form.get(val)?.touched) {
      esInvalido = true;
    }
    return esInvalido;
  }

  validHasError(val: string): number {
    let error = 0;
    if (this.form.get(val)?.hasError('required')) {
      error = 1;
    }
    if (this.form.get(val)?.hasError('email')) {
      error = 2;
    }
    return error;
  }

  executeForm(val: number) {
    if (val === 1) {
      // Login
      let usuario: UsuarioRequest = {} as UsuarioRequest;
      let password = this.form.get('password')?.value;
      let emailLogin = this.form.get('email')?.value;
      usuario.email = emailLogin;
      usuario.contrasenia = password;
  
      this.serviceAuth.login(usuario).subscribe({
        next: (resp) => {
          sessionStorage.setItem('token', JSON.stringify(resp));
          this.eventEmitterService.notificarActualizacion('token');
          let rolUsuario: number = resp.rol;
  
          switch (rolUsuario) {
            case 1: //Administrador
            localStorage.setItem('rolUser', '1'.toString());
            this.eventEmitterService.setRol(1);
              this.router.navigate(['/admin/listar-tecnicos']);
              break;
            case 2: //Tecnico 1
            localStorage.setItem('rolUser', '2'.toString());
            this.eventEmitterService.setRol(2);
              this.router.navigate(['/tecnicos/gestion-carga']);
              break;
            case 3: //Tecnico 2
            localStorage.setItem('rolUser', '3'.toString());
            this.eventEmitterService.setRol(3);
            this.router.navigate(['/tecnicos/calculador-individual']);
                break;
            default:
              this.router.navigate(['/notfound']);
          }
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error.respuesta,
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false
          });
          console.error('Error en el login', err);
        }
      });
  
    } else {
      // Registro
      let email = this.form.get('email')?.value;
      let contrasenia = this.form.get('password')?.value;
      let nombre = this.form.get('nombres')?.value;
      let apellido_paterno = this.form.get('apellido_paterno')?.value;
      let apellido_materno = this.form.get('apellido_materno')?.value;
      let dni = this.form.get('dni')?.value;
      let telefono = this.form.get('telefono')?.value;
  
      let usuario: UsuarioRequest = {
        idUsuario: '0', // Cambiar según la lógica de tu sistema
        nombre: nombre,
        apellidoPaterno: apellido_paterno,
        apellidoMaterno: apellido_materno,
        dni: dni,
        fechaNacimiento: this.fecha_nacimiento,
        telefono: telefono,
        imagen: '', // Deberías asignar la URL o el nombre del archivo si es necesario
        email: email,
        contrasenia: contrasenia,
        estado: 'True', // Ajusta según corresponda
        idRol: '3', // Por default es tecnico 2
      };

      console.log('USUARIO: ', usuario);
  
      this.userService.createUser(usuario, this.imagenFile).subscribe({
        next: (resp) => {
          console.log('RESPONSE: ', resp)
          // Al registrar con éxito, muestra un SweetAlert de éxito
          let codigoRespuesta: number = parseInt(resp.code);

          if(codigoRespuesta == 0){
            Swal.fire({
              icon: 'success',
              title: '¡Registro exitoso!',
              text: 'Te has registrado correctamente.',
              confirmButtonText: 'Aceptar',
              allowOutsideClick: false, // Deshabilita el cierre fuera del modal
              showCancelButton: false, // Evita mostrar el botón de cancelación
              reverseButtons: true, // Reversa los botones para darle más prominencia al de "Aceptar"
            }).then((result) => {
              if (result.isConfirmed) {
                // Al hacer clic en "Aceptar", redirige al login
                this.tipo = 1;
                this.titulo = 'Iniciar';
                this.form.reset();
                this.form.clearValidators();
              }
            });
          }else{
            Swal.fire({
              icon: 'error',
              title: '¡Error!',
              text: resp.message,
              confirmButtonText: 'Aceptar',
              allowOutsideClick: false, // Deshabilita el cierre fuera del modal
            });
          }



        },
        error: (err) => {
          console.log('ERROR: ', err)
          // Si el registro falla, muestra una alerta de error
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: err.error.message,
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false, // Deshabilita el cierre fuera del modal
          });
        }
      });
    
    }
  }
  

  irLogin(val: number) {
    this.tipo = val;
    this.titulo = 'Iniciar Sesi&oacute;n';
    this.descripcion = 'Ingrese';
    this.nameBtn = 'Ingresar';
  }

  irRegistro(val: number) {
    this.tipo = val;
    this.titulo = 'Registrarse';
    this.descripcion = 'Registrese';
    this.nameBtn = 'Continuar';
  }

  imagenSeleccionada: string | ArrayBuffer | null = null;
  imagenFileSeleccionado(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.imagenFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenSeleccionada = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onDateSelected() {
    let fecha_nacimiento = this.form.get('fecha_nacimiento')?.value;
    this.formatoFecha(fecha_nacimiento);
  }

  formatoFecha(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    this.fecha_nacimiento = `${year}-${month}-${day}`;
  }

  //NUEVO CODIGO
  openModalRecover(){
    const dialogRef = this.dialog.open(DialogRecoverComponent, {
      width: '700px', // Ancho del diálogo
      disableClose: true,
      data: { 
        tipoPlanilla: 'CONTINUA',
        mes: 'SETIEMBRE',
        anio: '2024'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo fue cerrado');
      console.log('Resultado: ', result);
    });
  }
}
