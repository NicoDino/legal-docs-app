import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Categoria } from 'src/app/models/categoria';
import { Router } from '@angular/router';
import { CategoriasService } from 'src/app/services/categorias.service';
import { EventsService } from '../services/events.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-arbol-item',
  templateUrl: './arbol-item.component.html',
  //   styleUrls: ['./arbol-item.component.css']
})
export class ArbolItemComponent implements OnInit, OnDestroy {
  @Input() categoria: Categoria;
  collapsed = false;
  identificador: string;
  unsubscribe$ = new Subject<void>();

  constructor(private router: Router, private categoriaService: CategoriasService, private eventos: EventsService) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.identificador = this.categoria.nombre + 'identificador';
  }

  crearCategoria(idPadre) {
    this.router.navigateByUrl(`crear-categoria/${idPadre}`);
  }

  borrarCategoria(idCategoria: string) {
    if (confirm('¿Está seguro de querer eliminar la categoría?')) {
      this.categoriaService.delete(idCategoria).pipe(takeUntil(this.unsubscribe$)).subscribe(
        (res) => {
          this.eventos.emitCategoriaBorrada();

        }
      );
    }
  }
}
