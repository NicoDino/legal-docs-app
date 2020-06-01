import { Component, OnInit, Input } from '@angular/core';
import { Categoria } from 'src/app/models/categoria';
import { Router } from '@angular/router';

@Component({
  selector: 'app-arbol-item',
  templateUrl: './arbol-item.component.html',
  //   styleUrls: ['./arbol-item.component.css']
})
export class ArbolItemComponent implements OnInit {
  @Input() categoria: Categoria;
  constructor(private router: Router) {}

  ngOnInit(): void {}

  crearCategoria(idPadre) {
    this.router.navigateByUrl(`crear-categoria/${idPadre}`);
  }
}
