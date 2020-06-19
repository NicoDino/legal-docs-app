import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Campo } from '../models/campo';

@Injectable({
  providedIn: 'root',
})
export class CamposService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  getAll() {
    return this.http.get<Campo[]>(`${this.apiUrl}/campos`);
  }

  getById(id: string) {
    return this.http.get<Campo>(`${this.apiUrl}/campos/${id}`);
  }

  create(campo: Partial<Campo>) {
    return this.http.post(`${this.apiUrl}/campos`, campo);
  }

  update(campo: Partial<Campo>) {
    return this.http.put(`${this.apiUrl}/campos/${campo._id}`, campo);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/campos/${id}`);
  }
}
