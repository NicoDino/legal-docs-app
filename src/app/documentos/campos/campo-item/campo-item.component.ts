import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CamposService } from 'src/app/services/campos.service';
import { EventsDocumentosService } from '../../services/eventsDocumentos.service';

@Component({
  selector: 'app-campo-item',
  templateUrl: './campo-item.component.html',
})
export class CampoItemComponent implements OnInit, OnDestroy {
  @Input() campoId: string;
  @Output() campoEliminado: EventEmitter<any> = new EventEmitter<any>();
  @Output() editarCampo: EventEmitter<string> = new EventEmitter<string>();

  campo: any = {};
  collapsed = false;
  identificador: string;
  unsubscribe$ = new Subject<void>();

  constructor(private campoService: CamposService, private eventos: EventsDocumentosService) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.campoService
      .getById(this.campoId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((registro) => {
        this.campo = registro;
        this.identificador = this.campo.nombre + 'identificador';
      });
  }

  borrarCampo(idCampo: string) {
    if (confirm('¿Está seguro de querer eliminar el campo?')) {
      this.campoService
        .delete(idCampo)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.eventos.emitDocumentoBorrado();
          this.campoEliminado.emit();
        });
    }
  }

  onEditarCampo(idCampo: string) {
    this.editarCampo.emit(idCampo);
  }
}
