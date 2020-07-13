import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Categoria } from 'src/app/models/categoria';
import { Router } from '@angular/router';
import { CategoriasService } from 'src/app/services/categorias.service';
import { EventsService } from '../services/events.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-arbol-item',
  templateUrl: './arbol-item.component.html',
  //   styleUrls: ['./arbol-item.component.css']
})
export class ArbolItemComponent implements OnInit, OnDestroy {
  @Input() categoria: Categoria;
  @Input() nivel: number;
  collapsed = false;
  identificador: string;
  unsubscribe$ = new Subject<void>();
  public loading = true;
  public sumarCampos = false;

  constructor(private router: Router, private categoriaService: CategoriasService, private eventos: EventsService) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.identificador = this.categoria.nombre + 'identificador';
    this.loading = false;
    this.sumarCampos = this.nivel < 2;
    this.nivel = this.nivel + 1;
  }

  crearCategoria(idPadre) {
    this.router.navigateByUrl(`/admin/crear-categoria/${idPadre}`);
  }

  editarCategoria(idCat: string) {
    this.router.navigateByUrl(`/admin/crear-categoria/editar/${idCat}`);
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
