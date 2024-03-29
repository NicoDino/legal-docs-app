import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Campo } from 'src/app/models/campo';
import { ToastrService } from 'ngx-toastr';
import { DocumentosService } from 'src/app/services/documentos.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Documento } from 'src/app/models/documento';

@Component({
  selector: 'app-crear-campo-component',
  templateUrl: 'crear-campo.component.html',
})
export class CrearCampoComponent implements OnInit, OnDestroy {
  campoForm: FormGroup;
  isEdicion = false;
  tinyEditorInstance;
  editorInitObject = {
    menubar: true,
    toolbar: true,
    height: 200,
    branding: false,
  };

  /* Inputs si es edicion, variables sino*/
  documento: Partial<Documento>;
  esSubdocumento = false;
  subdocumentos: any[];
  campo: Partial<Campo>;

  subdocumentosFiltrados: any[];
  /* Modal events */
  public modalCerrado: EventEmitter<any> = new EventEmitter<any>();
  public campoCreado: EventEmitter<any> = new EventEmitter<any>();

  /* Observables */
  showOpciones$ = new BehaviorSubject<boolean>(false);
  showOpcionesSubdocumento$ = new BehaviorSubject<boolean>(false);
  disableGuardar$ = new BehaviorSubject<boolean>(false);
  unsubscribe$ = new Subject<void>();

  constructor(
    private bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private documentosService: DocumentosService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,

  ) { }

  get opcionesFormArraySubdocumento() {
    return this.campoForm.get('opcionesSubdocumento') as FormArray;
  }

  get opcionesFormArray() {
    return this.campoForm.get('opciones') as FormArray;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    if (this.documento.padre) {
      this.esSubdocumento = true;
    }
    this.createForm();
    this.tipoWatcher();
    this.showOpciones$.next(
      this.campoForm.get('tipo').value === 'opciones' || this.campoForm.get('tipo').value === 'boolean'
    );
    this.showOpcionesSubdocumento$.next(this.campoForm.get('tipo').value === 'subdocumento');
    this.loadSubdocumentos();
  }

  private createForm() {
    this.campoForm = this.formBuilder.group({
      _id: new FormControl(this.campo ? this.campo._id : ''),
      nombre: new FormControl(this.campo ? this.campo.nombre : '', [Validators.required]),
      descripcion: new FormControl(this.campo ? this.campo.descripcion : ''),
      ayuda: new FormControl(this.campo ? this.campo.ayuda : ''),
      tipo: new FormControl(this.campo ? this.campo.tipo : '', [Validators.required]),
      opciones: this.formBuilder.array(this.addOpciones()),
      opcionesSubdocumento: this.formBuilder.array(this.addOpcionesSubdocumento()),
    });
    if (this.campo) {
      this.isEdicion = true;
    }
  }

  private addOpciones(): FormControl[] {
    const array = [];
    if (this.campo && this.campo.opciones && this.campo.opciones.length) {
      this.campo.opciones.forEach((opcion) => {
        array.push(new FormControl(opcion));
      });
      return array;
    } else {
      return array;
    }
  }

  private addOpcionesSubdocumento(): FormControl[] {
    const array = [];
    if (this.campo && this.campo.opcionesSubdocumento && this.campo.opcionesSubdocumento.length) {
      this.campo.opcionesSubdocumento.forEach((opcion) => {
        array.push(new FormControl(opcion.value));
        array.push(new FormControl(opcion.subdocumento));
      });
      return array;
    } else {
      return array;
    }
  }

  tipoWatcher() {
    this.campoForm.controls.tipo.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      this.formatearOpciones(value);
    });
  }

  private formatearOpciones(value: any) {
    if (!value) {
      return;
    }
    this.opcionesFormArray.clear();

    this.opcionesFormArray.push(new FormControl(''));
    if (value === 'boolean') {
      this.opcionesFormArray.push(new FormControl(''));
    }
    if (value === 'subdocumento') {
      this.opcionesFormArraySubdocumento.push(new FormControl(''));
      this.opcionesFormArraySubdocumento.push(new FormControl(''));
    }
    this.showOpciones$.next(value === 'opciones' || value === 'boolean');
    this.showOpcionesSubdocumento$.next(value === 'subdocumento');
  }

  handleEditorInit(event) {
    this.tinyEditorInstance = event.editor;
  }

  filtrarSubdocumentos(subdocumentos) {
    this.subdocumentosFiltrados = subdocumentos.filter(subdocumento => {
      return !subdocumento.campoAsociado;
    });
  }

  confirm() {
    // do stuff
    this.close();
  }

  agregarOpcion() {
    this.opcionesFormArray.push(new FormControl(''));
  }

  agregarOpcionSubdocumento() {
    this.opcionesFormArraySubdocumento.push(new FormControl(''));
    this.opcionesFormArraySubdocumento.push(new FormControl(''));
  }

  close() {
    this.modalCerrado.emit();
    this.bsModalRef.hide();
  }

  onSubmit() {
    if (!this.campoForm.valid) {
      this.toastr.error('Error', 'Complete todos los campos');
      return;
    }
    /* Limpiamos las opciones vacías, si existen */
    if (this.campoForm.value.tipo === 'opciones' && this.campoForm.value.opciones) {
      this.campoForm.value.opciones = this.campoForm.value.opciones.filter((opcion) => !!opcion);
    }

    if (this.campoForm.value.tipo === 'subdocumento' && this.campoForm.value.opcionesSubdocumento) {
      this.campoForm.value.opcionesSubdocumento = this.campoForm.value.opcionesSubdocumento.map((element, index) => {
        if (index % 2 === 0) {
          if (
            this.campoForm.value.opcionesSubdocumento[index] &&
            this.campoForm.value.opcionesSubdocumento[index + 1]
          ) {
            return {
              value: element,
              subdocumento: this.campoForm.value.opcionesSubdocumento[index + 1],
            };
          }
        }
      });
      this.campoForm.value.opcionesSubdocumento = this.campoForm.value.opcionesSubdocumento.filter(
        (opcion) => !!opcion
      );
    }

    this.campoCreado.emit({ campo: this.campoForm.value, esEdicion: this.isEdicion });
    this.bsModalRef.hide();
  }

  quitarSubdocumento(subdocumento, indice) {
    if (subdocumento) {
      this.spinner.show();
      this.subdocumentosFiltrados.push(subdocumento);
      subdocumento.campoAsociado = null;
      this.documentosService.update(subdocumento)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (res: any) => {
            this.loadSubdocumentos();
            this.filtrarSubdocumentos(this.subdocumentos);
          },
          () => {
            this.spinner.hide();
            this.disableGuardar$.next(false);
          }
        );
    }
    this.opcionesFormArraySubdocumento.removeAt(indice)
    this.opcionesFormArraySubdocumento.removeAt(indice)
  }

  private loadSubdocumentos() {
    this.documentosService.getAllSubdocumentos(this.documento._id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (rta: any) => {
          this.subdocumentos = rta;
          this.filtrarSubdocumentos(this.subdocumentos);
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
          this.disableGuardar$.next(false);
        });
  }
}
