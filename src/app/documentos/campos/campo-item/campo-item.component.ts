import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CamposService } from 'src/app/services/campos.service';
import { EventsDocumentosService } from '../../services/eventsDocumentos.service';
import { Campo } from 'src/app/models/campo';

@Component({
    selector: 'app-campo-item',
    templateUrl: './campo-item.component.html'
})
export class CampoItemComponent implements OnInit, OnDestroy {
    @Input() campoId: string;
    campo: any = {};
    collapsed = false;
    identificador: string;
    unsubscribe$ = new Subject<void>();

    constructor(private campoService: CamposService, private eventos: EventsDocumentosService) {
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    ngOnInit(): void {
        this.campoService.getById(this.campoId).subscribe(registro => {
            this.campo = registro;
            this.identificador = this.campo.nombre + 'identificador';
        });
    }

    borrarCampo(idCampo: string) {
        if (confirm('¿Está seguro de querer eliminar el campo?')) {
            this.campoService.delete(idCampo).pipe(takeUntil(this.unsubscribe$)).subscribe(
                (res) => {
                    this.eventos.emitDocumentoBorrado();

                }
            );
        }
    }
}
