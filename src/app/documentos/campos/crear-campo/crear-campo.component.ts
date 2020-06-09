import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';
import { CamposService } from 'src/app/services/campos.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-crear-campo',
    templateUrl: './crear-campo.component.html'
})
export class CrearCampoComponent implements OnInit, OnDestroy {
    campoForm: FormGroup;
    disableGuardar$ = new BehaviorSubject<boolean>(false);
    unsubscribe$ = new Subject<void>();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private camposService: CamposService
    ) { }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    ngOnInit(): void {
        this.route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe((params) => {
            this.campoForm = this.formBuilder.group({
                nombre: new FormControl(''),
                descripcion: new FormControl(''),
                identificador: new FormControl(''),
                tipo: new FormControl(''),
                documento: new FormControl(params.get('idDocumento')),
            });
        });
    }

    onSubmit() {
        this.disableGuardar$.next(true);
        this.camposService.create(this.campoForm.value).subscribe(
            (res) => {
                this.router.navigateByUrl('documentos');
            }, (err) => {
                this.disableGuardar$.next(false);
            }
        );
    }

    onCancel() {
        this.router.navigateByUrl('documentos');
    }
}