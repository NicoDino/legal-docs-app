import { Component } from '@angular/core';
import { Faq } from 'src/app/models/faq';
import { FaqsService } from 'src/app/services/faqs.service';

@Component({
    selector: 'app-public-faqs',
    templateUrl: './faqs.component.html',
    styleUrls: ['./../public.css']
})
export class PublicFaqsComponent {
    faqs: any[] = [];
    public loading = true;

    constructor(private faqsService: FaqsService) { }

    ngOnInit(): void {
        this.getFaqs();
    }

    private getFaqs() {
        this.faqsService.getAllPublic().subscribe(resultado => {
            this.faqs = resultado;
            this.faqs.forEach(element => {
                element.active = false;
            });
            this.loading = false;
        });
    }

}
