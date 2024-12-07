import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { BodyResponse } from 'src/app/core/models/BodyResponse';
import { Usuario } from 'src/app/core/models/Usuario';
import { UsuarioRequest } from 'src/app/core/models/UsuarioRequest';
import { URL_MS_AUTH } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: any;
  private headersAut: any;
  private urlApiAuth = URL_MS_AUTH.apiUrl;

  constructor(private http: HttpClient) {
    // this.urlApi = urlApiAuth;
    this.token = this.obtenerToken();
    this.headersAut = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
  }

  obtenerToken() {
    const token = sessionStorage.getItem('token');
    return token ? JSON.parse(token) : null;
  }

  login(usuario:UsuarioRequest):Observable<any>{
    // console.log(usuario)
    let body = 'username='+usuario.email+ '&password=' +usuario.contrasenia + '&grant_type=password';
    let headAuthBas = this.headersAut.set('Authorization', 'Basic ' + btoa('user:user'));


    return this.http.post<any>(this.urlApiAuth +'oauth/token',body,{headers:headAuthBas});

  }

  // Método para restablecer la contraseña
  resetPassword(token: string, password: string): Observable<BodyResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<BodyResponse>(
      `${this.urlApiAuth}api/auth/resetPassword?token=${token}`,
      { password },
      { headers }
    );
  }

  forgotPassword(email: string): Observable<BodyResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<BodyResponse>(
      `${this.urlApiAuth}api/auth/forgotPassword`,
      { email },
      { headers }
    );
  }

  getUser(
    idUsuario: string,
    headers: {
      correlatorId?: string;
      messageId?: string;
      requestDate?: string;
      originSystem?: string;
      targetSystem?: string;
      country?: string;
    } = {}
  ): Observable<any> {
    if (!idUsuario) {
      throw new Error("El parámetro 'idUsuario' es obligatorio.");
    }

    // Configuración de parámetros de consulta
    const params = new HttpParams().set('idUsuario', idUsuario);

    // Realizar la solicitud GET
    return this.http.get(this.urlApiAuth+'getUser', { params });
  }



}
