import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { UserService } from 'src/app/admin/services/user.service';
import { UsuarioRequest } from 'src/app/core/models/UsuarioRequest';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-perfil',
  templateUrl: './ver-perfil.component.html',
  styleUrls: ['./ver-perfil.component.scss']
})
export class VerPerfilComponent {
  form!: FormGroup;
  tipo_form = "Ver"
  fecha_nacimiento = ""
  isFormEditable = false;
  imagenFile: File | null = null;
  clienteActualizar:any;

  usuario: UsuarioRequest = {
    idUsuario: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    dni: '',
    fechaNacimiento: '',
    telefono: '',
    imagen: '',
    email: '',
    contrasenia: '',
    estado: '',
    idRol: '',
  };

  token:any;
  // es un ejemplo de objeto cliente usando el interfaz line 123
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialog: MatDialog
    ) {
    let token = JSON.parse(sessionStorage.getItem('token')?.toString() || '{}');

    // Asignar los valores del token al objeto cliente || aqui se tiene que implementar el service
    if (token != null) {
      this.usuario.nombre = token.nombre;
      this.usuario.apellidoPaterno = token.apellido_paterno;
      this.usuario.apellidoMaterno = token.apellido_materno;
      this.usuario.dni = token.dni;
      this.usuario.telefono = token.telefono;
      this.usuario.email = token.email;
      this.usuario.imagen = token.imagen;
      this.usuario.fechaNacimiento = token.fecha_nacimiento;
      this.usuario.idUsuario= token.id;
      this.token = token;
    }

    console.log('fecha_nacimiento: ', this.usuario.fechaNacimiento);

    // solo asigna los valores del cliente al form
    this.form = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      apellidoPaterno: [this.usuario.apellidoPaterno, Validators.required],
      apellidoMaterno: [this.usuario.apellidoMaterno, Validators.required],
      dni: [this.usuario.dni, Validators.required],
      fechaNacimiento: [new Date(this.usuario.fechaNacimiento), Validators.required],
      telefono: [this.usuario.telefono, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
      imagen: [''],
      // Agrega otros campos según sea necesario
    });

    // deshabilitar el formulario por defecto
    this.form.disable();
    this.traerImagenCliente();
  }

  async traerImagenCliente(){
    try {
      const response = await lastValueFrom(
        this.userService.getImageUser(
          this.usuario.imagen
        )
      );
      const reader = new FileReader();
      //aqui↓
      this.imagenFile = new File(
        [response],
        this.usuario.imagen,
        { type: response.type }
      );
      reader.onload = () => {
        this.imagenSeleccionada = reader.result;
      };
      reader.readAsDataURL(response);
    } catch (e) {
      console.log(e);
    }
  }
  
  submitForm() {
    if (this.form.valid) {
    
      this.usuario.idUsuario = this.token.id;
      this.usuario.telefono = this.form.get('telefono')?.value;

      this.userService.updateUser(this.usuario, this.imagenFile).subscribe({
        next: (resp) => {

          let codigoRespuesta: number = +resp.code;

          if(codigoRespuesta === 0){
            this.token.telefono = this.usuario.telefono;  
            this.token.imagen = resp.imagen;
        
            let jsonToken = JSON.stringify(this.token);
            sessionStorage.setItem('token',jsonToken); 
            this.showSuccessAlert();
            this.form.disable();
          }else{
            this.showErrorAlert(resp.message);
          }

        },
        error: (err) => {
          this.showErrorAlert(err.error.respuesta)
        }
      });
      this.isFormEditable = false;
      console.log(this.form.value);
    }
  }

  private showSuccessAlert() {
    Swal.fire({
      icon: 'success',
      title: '¡Registro exitoso!',
      text: 'Se actualizó correctamente.',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
      showCancelButton: false,
      reverseButtons: true,
    });
  }

  private showErrorAlert(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
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
  formatoFecha(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    this.fecha_nacimiento= `${day}-${month}-${year}`;

  }

  onDateSelected() {
    let fecha  = this.form.get('fechaNacimiento')?.value
    this.formatoFecha(fecha)
  }

  toggleFormEditable() {
    this.isFormEditable = !this.isFormEditable;
    if (this.isFormEditable) {
      const controlTelefono = this.form.get('telefono');
      const controlImagen = this.form.get('imagen');
      if (controlTelefono) {
        controlTelefono.enable();
      }
      if (controlImagen) {
        controlImagen.enable();
      }
      this.tipo_form = "Actualizar";
    } else {
      this.form.disable();
      this.tipo_form = "Ver";
    }
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
      if(this.tipo_form=="Actualizar"){
        this.usuario.imagen = "cambiado"
      }
    }

  }

  
}
