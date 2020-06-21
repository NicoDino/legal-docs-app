import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CamposService } from 'src/app/services/campos.service';
import { EventsDocumentosService } from '../../services/eventsDocumentos.service';
import { Campo } from 'src/app/models/campo';

@Component({
  selector: 'app-campo-item',
  templateUrl: './campo-item.component.html',
})
export class CampoItemComponent implements OnInit, OnDestroy {
  @Input() campo: Partial<Campo>;
  @Output() campoEliminado: EventEmitter<any> = new EventEmitter<any>();
  @Output() editarCampo: EventEmitter<Partial<Campo>> = new EventEmitter<Partial<Campo>>();

  collapsed = false;
  unsubscribe$ = new Subject<void>();

  constructor(private campoService: CamposService, private eventos: EventsDocumentosService) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {}

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

  onEditarCampo() {
    this.editarCampo.emit(this.campo);
  }
}
