import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { UsuarioRequest } from '../../core/models/UsuarioRequest';
import { URL_MS_USER } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private urlApiAuth = URL_MS_USER.apiUrl;

  constructor(private http: HttpClient) {}

  listUsers(): Observable<any> {
    return this.http.get(`${this.urlApiAuth}5ta-support-serv-user/v1/listUser`);
  }

  deleteUser(idUsuario: number): Observable<string> {
    const url = `${this.urlApiAuth}5ta-support-serv-user/v1/deleteUser/${idUsuario}`;
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token'), // Si usas autenticación
    });

    return this.http.put(url, {}, { headers, responseType: 'text' });
  }

  changeUser(idUsuario: number, idRol: number): Observable<string> {
    const url = `${this.urlApiAuth}5ta-support-serv-user/v1/changeRol/${idUsuario}/${idRol}`;
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token'), // Si usas autenticación
    });

    return this.http.put(url, {}, { headers, responseType: 'text' });
  }

  // Manejo de errores
  private handleError(error: any) {
    console.error('Error en la solicitud HTTP:', error);
    return throwError(error);
  }

  createUser(usuario: UsuarioRequest, imagen: any ): Observable<any> {
    // Convertir el objeto usuario a JSON
    const usuarioGson = JSON.stringify(usuario);

    // Crear un FormData y agregar los parámetros
    const formData = new FormData();
    formData.append('usuario', usuarioGson);  // El objeto 'usuario' convertido a JSON
    formData.append('imagen', imagen);        // El archivo de imagen

    // Hacer la solicitud POST
    return this.http.post<any>(`${this.urlApiAuth}5ta-support-serv-user/v1/createUser`, formData);
  }



  getImageUser(nombre_imagen:string){
    return this.http.get(`${this.urlApiAuth}5ta-support-serv-user/v1/imagen/usuarios/${nombre_imagen}`, { responseType: 'blob' });
  }

  updateUser(usuario: UsuarioRequest, imagen: any){
    const usuarioGson = JSON.stringify(usuario);

    const formData = new FormData();
    formData.append('usuario', usuarioGson);  // El objeto 'usuario' convertido a JSON
    formData.append('imagen', imagen);        // El archivo de imagen

    return this.http.put<any>(`${this.urlApiAuth}5ta-support-serv-user/v1/updateUser`, formData);
  }

}
