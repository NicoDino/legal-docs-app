import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Categoria } from 'src/app/models/categoria';
import { Router } from '@angular/router';

@Component({
  selector: 'app-arbol-item',
  templateUrl: './arbol-item.component.html',
  //   styleUrls: ['./arbol-item.component.css']
})
export class ArbolItemComponent implements OnInit {
  @Input() categoria: Categoria;
  collapsed = false;
  identificador: string;
  constructor(private router: Router) {}


  ngOnInit(): void {
    this.identificador = this.categoria.nombre + 'identificador';
  }

  crearCategoria(idPadre) {
    this.router.navigateByUrl(`crear-categoria/${idPadre}`);
  }


}
