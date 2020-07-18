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
  constructor(private borradoresService: BorradoresService) {}

  ngOnInit(): void {
    this.getBorradores();
  }

  private getBorradores() {
    this.$borradores = this.borradoresService.getAll();
  }

  reenviar(borrador) {
    this.borradoresService.reenviar(borrador).subscribe((res) => {
      alert('Documento reenviado!');
    });
  }
}
