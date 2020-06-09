import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventsDocumentosService {

    // Observable string sources
    private documentoBorradoSource = new Subject<string>();

    // Observable string streams
    documentoBorrado$ = this.documentoBorradoSource.asObservable();

    // Service message commands
    emitDocumentoBorrado() {
        this.documentoBorradoSource.next('Actualizar');
    }


}
