import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_MS_PAYROLL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PayrollService {

  
  private apiUrl = URL_MS_PAYROLL.apiUrl;
  private token: string | null = null;

  constructor(private http: HttpClient) {
    const tokenString = sessionStorage.getItem("token"); 
    if (tokenString) {
      const tokenObject = JSON.parse(tokenString); // Convertir a objeto JSON
      this.token = tokenObject.access_token; // Extraer solo el access_token
    }
  }

  createPayroll(file: File): Observable<any> {
    const formData = new FormData(); // Crea un objeto FormData
    formData.append('file', file); // Agrega el archivo al FormData

    const requestDate = new Date().toISOString(); // '2024-10-10T00:00:00Z' -> formato ISO

    // Configura los headers
    const headers = new HttpHeaders({
      'country': 'PERU',
      'originSystem': '5TACAT',
      'requestDate': requestDate,
      'messageId': 'EAI',
      'correlatorId': '123456',
      'targetSystem': 'Angular',
      'Authorization': 'Basic ' + this.token
    });

    return this.http.post(
      this.apiUrl + '5ta-business-serv-payroll/v1/createPayroll',
      formData,
      { headers }
    ); // Realiza la solicitud POST
  }

  getPeriodoAndTipoPayroll(file: File): Observable<any> {
    const formData = new FormData(); // Crea un objeto FormData
    formData.append('file', file); // Agrega el archivo al FormData

    const requestDate = new Date().toISOString(); // '2024-10-10T00:00:00Z' -> formato ISO

    // Configura los headers
    const headers = new HttpHeaders({
      'country': 'PERU',
      'originSystem': '5TACAT',
      'requestDate': requestDate,
      'messageId': 'EAI',
      'correlatorId': '123456',
      'targetSystem': 'Angular',
      'Authorization': 'Basic ' + this.token
    });

    return this.http.post(
      this.apiUrl + '5ta-business-serv-payroll/v1/getPeriodoAndTipoPayroll',
      formData,
      { headers }
    ); // Realiza la solicitud POST
  }


}
