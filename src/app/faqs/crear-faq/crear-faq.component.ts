import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FaqsService } from 'src/app/services/faqs.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Faq } from 'src/app/models/faq';

@Component({
    selector: 'app-crear-faq',
    templateUrl: './crear-faq.component.html'
})
export class CrearFaqComponent implements OnInit, OnDestroy {
    faqForm: FormGroup;
    disableGuardar$ = new BehaviorSubject<boolean>(false);
    unsubscribe$ = new Subject<void>();
    faq: Partial<Faq> = {};
    public loading = true;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private faqService: FaqsService,
        private route: ActivatedRoute
    ) { }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    ngOnInit(): void {
        this.faqForm = this.formBuilder.group({
            pregunta: new FormControl('', [Validators.required]),
            contenido: new FormControl('', [Validators.required])
        });
        this.loadFaq();
    }

    private loadFaq() {
        this.route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe((params) => {
            this.faq._id = params.get('idFaq');
            if (this.faq._id) {
                this.faqService.getById(this.faq._id).subscribe((rta: any) => {
                    this.faq = rta;
                    this.faqForm.controls.pregunta.setValue(rta.pregunta);
                    this.faqForm.controls.contenido.setValue(rta.contenido);
                    this.loading = false;
                });
            } else {
                this.loading = false;
            }
        });
    }

    onSubmit() {
        if (this.faqForm.invalid) {
            alert('Debe completar todos los campos');
            return;
        }
        this.disableGuardar$.next(true);
        if (!this.faq._id) {
            this.faqService.create(this.faqForm.value).subscribe(
                (res) => {
                    this.router.navigate(['/admin/faqs']);
                }, (err) => {
                    this.disableGuardar$.next(false);
                }
            );
        } else {
            const faqEditada = this.faqForm.value;
            faqEditada._id = this.faq._id;
            this.faqService.update(faqEditada).subscribe(
                (res: any) => {
                    this.faq = res;
                    this.disableGuardar$.next(false);
                    this.router.navigate(['/admin/faqs']);
                },
                () => {
                    this.disableGuardar$.next(false);
                }
            );
        }
    }

    onCancel() {
        this.router.navigateByUrl('/admin/faqs');
    }
}
