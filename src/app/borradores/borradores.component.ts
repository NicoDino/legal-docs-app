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
  public documento;
  public borradores;
  public enviando = false;
  public borrando = false;

  constructor(private borradoresService: BorradoresService) { }

  ngOnInit(): void {
    this.getBorradores();
  }

  private getBorradores() {
    this.$borradores = this.borradoresService.getAll();
    this.filtrar();
  }

  reenviar(borrador) {
    if (confirm('¿Está seguro de querer reenviar el borrador?')) {
      this.enviando = true;
      this.borradoresService.reenviar(borrador).subscribe((res) => {
        alert('Documento reenviado!');
        this.enviando = false;
      },
        () => {
          this.enviando = false;
        });
    }
  }

  eliminar(borrador) {
    if (confirm('¿Está seguro de querer eliminar el borrador?')) {
      this.borrando = true;
      this.borradoresService.delete(borrador._id).subscribe((res) => {
        this.borrando = false;
        this.filtrar();
      },
        () => {
          this.borrando = false;
        });
    }
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
      if (this.documento) {
        this.borradores = this.borradores.filter((element: any) => {
          return element.documento?.nombre.toLowerCase().includes(this.documento.toLowerCase());
        });
      };
    });
  }
}
