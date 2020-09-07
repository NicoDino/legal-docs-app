import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Borrador } from '../models/borrador';

@Injectable({
  providedIn: 'root',
})
export class BorradoresService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  getAll() {
    return this.http.get<Borrador[]>(`${this.apiUrl}/borradores`);
  }

  create(borrador: any) {
    return this.http.post<string>(`${this.apiUrl}/borradores`, { borrador });
  }

  reenviar(borrador: Borrador) {
    return this.http.post<string>(`${this.apiUrl}/borradores/reenviar`, { borrador });
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/borradores/${id}`);
  }
}
