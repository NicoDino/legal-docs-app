import { Component, OnInit } from '@angular/core';
import { FaqsService } from '../services/faqs.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EventsFaqsService } from './services/eventsFaqs.service';
import { Faq } from '../models/faq';

@Component({
    selector: 'app-faqs',
    templateUrl: './faqs.component.html'
})
export class FaqsComponent implements OnInit {

    // categorias: Categoria[];
    $faqs: Observable<Faq[]> = new Observable<Faq[]>();
    faqs: Faq[];
    public loading = true;

    constructor(private faqsService: FaqsService, private router: Router, private eventos: EventsFaqsService) { }

    ngOnInit(): void {
        this.getFaqs();
        this.eventos.faqBorrada$.subscribe(evento => { this.getFaqs(); });
    }

    private getFaqs() {
        this.$faqs = this.faqsService.getAll();
        this.loadElements();
    }

    crearFaq() {
        this.router.navigateByUrl('/admin/crear-faq');
    }

    borrarFaq(idFaq: string) {
        if (confirm("¿Está seguro de querer eliminar la pregunta?")) {
            this.faqsService.delete(idFaq).subscribe(
                (res) => {
                    this.eventos.emitFaqBorrada();

                }
            );
        }
    }
    editarFaq(idFaq: string) {
        this.router.navigateByUrl(`admin/crear-faq/${idFaq}`);
    }

    loadElements() {
        this.$faqs.subscribe((values) => {
            this.faqs = values;
            this.loading = false;
        });
    }
}
