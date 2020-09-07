import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Documento } from '../models/documento';

@Injectable({
  providedIn: 'root',
})
export class DocumentosService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  search(busqueda: string) {
    return this.http.get<Documento[]>(`${this.apiUrl}/documentos/search/${busqueda}`);
  }

  getAllSubdocumentos(padre) {
    return this.http.get<Documento[]>(`${this.apiUrl}/documentos/subdocumentos/${padre}`);
  }

  getAll() {
    return this.http.get<Documento[]>(`${this.apiUrl}/documentos`);
  }

  getAllPublic() {
    return this.http.get<Documento[]>(`${this.apiUrl}/documentos/public`);
  }

  getById(id: string) {
    return this.http.get<Documento>(`${this.apiUrl}/documentos/${id}`);
  }

  getByIdPublic(id: string) {
    return this.http.get<Documento>(`${this.apiUrl}/documentos/public/${id}`);
  }

  create(documento: Documento) {
    return this.http.post(`${this.apiUrl}/documentos`, documento);
  }

  update(documento: Partial<Documento>) {
    return this.http.put(`${this.apiUrl}/documentos/${documento._id}`, documento);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/documentos/${id}`);
  }
}
