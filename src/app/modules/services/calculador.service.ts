import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataResponse } from 'src/app/core/models/DataResponse';
import { URL_MS_CALCULATOR } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalculadorService {

  private apiUrl = URL_MS_CALCULATOR.apiUrl;

  constructor(private http: HttpClient) {
  }

  getHaberDetails(codigoModular: string): Observable<DataResponse> {
    let params = new HttpParams().set('codigoModular', codigoModular);
    return this.http.get<DataResponse>(this.apiUrl+'5ta-support-serv-calculator/v1/getProjection', { params });
  }

}
