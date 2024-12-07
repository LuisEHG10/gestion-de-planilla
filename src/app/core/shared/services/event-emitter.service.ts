import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  private rolAdmin$ = new BehaviorSubject<number>(0);

  constructor() { }

  setRol(rolAdmin: number){
    this.rolAdmin$.next(rolAdmin);
  }

  getRol(){
    return this.rolAdmin$.asObservable();
  }

  notificarActualizacion(key: string): void {
    this.localStorageUpdateSubject.next(key);
  }

  private localStorageUpdateSubject = new Subject<string>();

  localStorageUpdate$ = this.localStorageUpdateSubject.asObservable();

}
