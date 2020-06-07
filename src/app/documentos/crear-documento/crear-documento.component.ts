import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';
import { DocumentosService } from 'src/app/services/documentos.service';

@Component({
    selector: 'app-crear-documento',
    templateUrl: './crear-documento.component.html'
})
export class CrearDocumentoComponent implements OnInit, OnDestroy {
    documentoForm: FormGroup;
    disableGuardar$ = new BehaviorSubject<boolean>(false);
    unsubscribe$ = new Subject<void>();

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private documentosService: DocumentosService
    ) { }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    ngOnInit(): void {
        this.documentoForm = this.formBuilder.group({
            nombre: new FormControl(''),
            precio: new FormControl(''),
            tipo: new FormControl(''),
            html: new FormControl('')
        });
    }

    onSubmit() {
        this.disableGuardar$.next(true);
        this.documentosService.create(this.documentoForm.value).subscribe(
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