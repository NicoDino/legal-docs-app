import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';
import { CamposService } from 'src/app/services/campos.service';
import { takeUntil } from 'rxjs/operators';
import { Documento } from 'src/app/models/documento';

@Component({
    selector: 'app-crear-campo',
    templateUrl: './crear-campo.component.html'
})
export class CrearCampoComponent implements OnInit, OnDestroy {
    @ViewChild('closeModal') buttonClose: ElementRef;
    campoForm: FormGroup;
    disableGuardar$ = new BehaviorSubject<boolean>(false);
    unsubscribe$ = new Subject<void>();
    @Input() documento: Documento;
    @Output() onCampoGuardar: EventEmitter<any> = new EventEmitter<any>();

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
        this.campoForm = this.formBuilder.group({
            nombre: new FormControl(''),
            descripcion: new FormControl(''),
            identificador: new FormControl(''),
            tipo: new FormControl(''),
            documento: new FormControl(this.documento._id),
        });
    }

    onSubmit() {
        this.campoForm.controls['documento'].setValue(this.documento._id);
        this.disableGuardar$.next(true);
        this.camposService.create(this.campoForm.value).subscribe(
            (res) => {
                this.buttonClose.nativeElement.click();
                this.onCampoGuardar.emit();
            }, (err) => {
                this.disableGuardar$.next(false);
            }
        );
    }

    onCancel() {
        this.router.navigateByUrl('documentos');
    }
}