import { Component, OnInit } from '@angular/core';
import { CategoriasService } from '../services/categorias.service';
import { Categoria } from '../models/categoria';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventsService } from './services/events.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

  // categorias: Categoria[];
  $categorias: Observable<Categoria[]> = new Observable<Categoria[]>();
  constructor( private categoriaService: CategoriasService, private router: Router, private eventos: EventsService) { }

  ngOnInit(): void {
    this.getCategorias();

    this.eventos.categoriaBorrada$.subscribe(evento => {this.getCategorias(); });
  }

  private getCategorias() {
    this.$categorias = this.categoriaService.getAll();
  }

  crearCategoria(){
    this.router.navigateByUrl('crear-categoria/');
  }


}
