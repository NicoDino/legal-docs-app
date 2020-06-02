import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

 // Observable string sources
 private categoriaBorradaSource = new Subject<string>();

 // Observable string streams
 categoriaBorrada$ = this.categoriaBorradaSource.asObservable();

 // Service message commands
 emitCategoriaBorrada() {
   this.categoriaBorradaSource.next('Actualizar');
 }


}
