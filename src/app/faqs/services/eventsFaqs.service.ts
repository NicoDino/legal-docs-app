import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventsFaqsService {

    // Observable string sources
    private faqBorradaSource = new Subject<string>();

    // Observable string streams
    faqBorrada$ = this.faqBorradaSource.asObservable();

    // Service message commands
    emitFaqBorrada() {
        this.faqBorradaSource.next('Actualizar');
    }


}
