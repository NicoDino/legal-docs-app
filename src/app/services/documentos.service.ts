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

    getAll() {
        return this.http.get<Documento[]>(`${this.apiUrl}/documentos`);
    }

    getById(id: string) {
        return this.http.get<Documento[]>(`${this.apiUrl}/documentos/${id}`);
    }

    create(documento: Documento) {
        return this.http.post(`${this.apiUrl}/documentos`, documento);
    }

    update(documento: Documento) {
        return this.http.put(`${this.apiUrl}/documentos/${documento._id}`, documento);
    }

    delete(id: string) {
        return this.http.delete(`${this.apiUrl}/documentos/${id}`);
    }
}
