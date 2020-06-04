import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FaqsService } from 'src/app/services/faqs.service';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-crear-faq',
    templateUrl: './crear-faq.component.html'
})
export class CrearFaqComponent implements OnInit, OnDestroy {
    faqForm: FormGroup;
    disableGuardar$ = new BehaviorSubject<boolean>(false);
    unsubscribe$ = new Subject<void>();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private faqService: FaqsService
    ) { }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    ngOnInit(): void {
        this.faqForm = this.formBuilder.group({
            pregunta: new FormControl(''),
            contenido: new FormControl('')
        });
    }

    onSubmit() {
        this.disableGuardar$.next(true);
        this.faqService.create(this.faqForm.value).subscribe(
            (res) => {
                this.router.navigateByUrl('faqs');
            }, (err) => {
                this.disableGuardar$.next(false);
            }
        );
    }

    onCancel() {
        this.router.navigateByUrl('faqs');
    }
}
