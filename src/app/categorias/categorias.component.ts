import { Component, OnInit } from '@angular/core';
import { CategoriasService } from '../services/categorias.service';
import { Categoria } from '../models/categoria';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

  categorias: Categoria[];
  constructor( private categoriaService: CategoriasService, private router: Router) { }

  ngOnInit(): void {
    this.categoriaService.getAll().subscribe(
      (res: Categoria[]) => {
        this.categorias = res;
    },
    err => {
      console.error(err);
    });
  }

  crearCategoria(){
    this.router.navigateByUrl('crear-categoria/');
  }
}
