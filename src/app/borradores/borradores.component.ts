import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BorradoresService } from '../services/borradores.service';
import { Borrador } from '../models/borrador';

@Component({
  selector: 'app-borradores',
  templateUrl: './borradores.component.html',
})
export class BorradoresComponent implements OnInit {

  $borradores: Observable<Borrador[]> = new Observable<Borrador[]>();
  public desde;
  public hasta;
  public email;
  public borradores;
  public enviando = false;

  constructor(private borradoresService: BorradoresService) { }

  ngOnInit(): void {
    this.getBorradores();
  }

  private getBorradores() {
    this.$borradores = this.borradoresService.getAll();
    this.filtrar();
  }

  reenviar(borrador) {
    this.enviando = true;
    this.borradoresService.reenviar(borrador).subscribe((res) => {
      alert('Documento reenviado!');
      this.enviando = false;
    },
      () => {
        this.enviando = false;
      });
  }

  filtrar() {
    this.$borradores.subscribe(resultado => {
      this.borradores = resultado;
      if (this.desde) {
        this.borradores = this.borradores.filter(element =>
          element.createdAt >= this.desde)
      }
      if (this.hasta) {
        this.borradores = this.borradores.filter(element =>
          element.createdAt <= this.hasta)
      }
      if (this.email) {
        this.borradores = this.borradores.filter((element: any) => {
          return element.emailCliente.includes(this.email);
        });
      };
    });
  }
}
