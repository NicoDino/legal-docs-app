import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Categoria } from 'src/app/models/categoria';
import { Router } from '@angular/router';
import { CategoriasService } from 'src/app/services/categorias.service';

@Component({
  selector: 'app-arbol-item',
  templateUrl: './arbol-item.component.html',
  //   styleUrls: ['./arbol-item.component.css']
})
export class ArbolItemComponent implements OnInit, OnDestroy {
  @Input() categoria: Categoria;
  @Output() refresh = new EventEmitter<any>();
  collapsed = false;
  identificador: string;
  constructor(private router: Router, private categoriaService: CategoriasService) {}

  ngOnDestroy(): void {
    // TODO - unsubscribe to avoid memory leaks
  }

  ngOnInit(): void {
    this.identificador = this.categoria.nombre + 'identificador';
  }

  crearCategoria(idPadre) {
    this.router.navigateByUrl(`crear-categoria/${idPadre}`);
  }

  borrarCategoria(idCategoria: string) {
    this.categoriaService.delete(idCategoria).subscribe(
      (res) => {
        this.refresh.emit(null);
      },
      (err) => {
        // TODO - mostrar toast con error
      }
    );
  }
}
