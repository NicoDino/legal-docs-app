import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Faq } from '../models/faq';

@Injectable({
    providedIn: 'root',
})
export class FaqsService {
    private apiUrl: string;

    constructor(private http: HttpClient) {
        this.apiUrl = environment.apiUrl;
    }

    getAll() {
        return this.http.get<Faq[]>(`${this.apiUrl}/faqs`);
    }

    getAllPublic() {
        return this.http.get<Faq[]>(`${this.apiUrl}/faqs/public`);
    }

    create(faq: Faq) {
        return this.http.post(`${this.apiUrl}/faqs`, faq);
    }

    delete(id: string) {
        return this.http.delete(`${this.apiUrl}/faqs/${id}`);
    }
}
