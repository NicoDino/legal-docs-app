import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';
import { DocumentosService } from 'src/app/services/documentos.service';
import { takeUntil } from 'rxjs/operators';
import { Documento } from 'src/app/models/documento';

@Component({
    selector: 'app-crear-documento',
    templateUrl: './crear-documento.component.html',
    styleUrls: ['crear-documento.component.css'],
})
export class CrearDocumentoComponent implements OnInit, OnDestroy {

    documentoForm: FormGroup = this.formBuilder.group({
        nombre: new FormControl(''),
        precio: new FormControl(''),
        tipo: new FormControl(''),
        html: new FormControl('')
    });
    disableGuardar$ = new BehaviorSubject<boolean>(false);
    unsubscribe$ = new Subject<void>();
    currentTab = 0;
    documento: Documento = {
        _id: '',
        nombre: '',
        html: '',
        campos: [],
        tipo: '',
        nombresAlternativos: [],
        categoria: '',
        referencias: [],
        preview: null,
        precio: 0
    };

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private documentosService: DocumentosService,
        private route: ActivatedRoute
    ) {
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    ngOnInit(): void {
        this.route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe((params) => {
            const idDocumento = params.get('idDocumento');
            if (idDocumento) {
                this.documentosService.getById(idDocumento).subscribe((rta: any) => {
                    this.documento = rta;
                    this.documentoForm = this.formBuilder.group({
                        nombre: new FormControl(rta.nombre),
                        precio: new FormControl(rta.precio),
                        tipo: new FormControl(rta.tipo),
                        html: new FormControl(rta.html)
                    });
                    this.currentTab = Number(params.get('step')); // Current tab is set to be the first tab (0)
                    this.showTab(this.currentTab);
                });
            } else {
                this.currentTab = 0; // Current tab is set to be the first tab (0)
                this.showTab(this.currentTab);
            }
        });
    }

    onSubmit() {
        this.disableGuardar$.next(true);
        this.documentosService.create(this.documentoForm.value).subscribe(
            (res: any) => {
                this.documento = res.data;
            }, (err) => {
            }
        );
        this.disableGuardar$.next(false);
        this.nextPrev(1);
    }

    guardarHtml() {
        this.documento.html = this.documentoForm.controls['html'].value;
        this.documentosService.update(this.documento).subscribe(
            (res: any) => {
                this.documento = res.data;
                this.onCancel();
            }, (err) => {
            }
        );
    }

    onCancel() {
        this.router.navigateByUrl('documentos');
    }

    showTab(n) {
        // This function will display the specified tab of the form ...
        var x = document.getElementsByClassName("tab");
        x[n].setAttribute("style", "display:block;");
        // ... and run a function that displays the correct step indicator:
        this.fixStepIndicator(n);
    }

    nextPrev(n) {
        // This function will figure out which tab to display
        var x = document.getElementsByClassName("tab");
        // Hide the current tab:
        x[this.currentTab].setAttribute("style", "display:none;");
        // Increase or decrease the current tab by 1:
        this.currentTab = this.currentTab + n;
        // if you have reached the end of the form... :
        if (this.currentTab >= x.length) {
            //...the form gets submitted:
            return false;
        }
        // Otherwise, display the correct tab:
        this.showTab(this.currentTab);
    }

    validateForm() {
        // This function deals with validation of the form fields
        var x, y, i, valid = true;
        x = document.getElementsByClassName("tab");
        y = x[this.currentTab].getElementsByTagName("input");
        // A loop that checks every input field in the current tab:
        for (i = 0; i < y.length; i++) {
            // If a field is empty...
            if (y[i].value == "") {
                // add an "invalid" class to the field:
                y[i].className += " invalid";
                // and set the current valid status to false:
                valid = false;
            }
        }
        // If the valid status is true, mark the step as finished and valid:
        if (valid) {
            document.getElementsByClassName("step")[this.currentTab].className += " finish";
        }
        return valid; // return the valid status
    }

    fixStepIndicator(n) {
        // This function removes the "active" class of all steps...
        var i, x = document.getElementsByClassName("step");
        for (i = 0; i < x.length; i++) {
            x[i].className = x[i].className.replace(" active", "");
        }
        //... and adds the "active" class to the current step:
        x[n].className += " active";
    }

    closeModal(): void {
        this.documentosService.getById(this.documento._id).subscribe((rta: any) => {
            this.documento = rta;
        });
    }
}