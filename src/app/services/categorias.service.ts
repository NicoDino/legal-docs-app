import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Categoria } from '../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
 }

getAll() {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`);
}

create(categoria: Categoria){
  return this.http.post(`${this.apiUrl}/categorias`, categoria);
}


}