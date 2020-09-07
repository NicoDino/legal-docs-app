import { Component, OnInit, OnDestroy, EventEmitter, Output, ElementRef, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';
import { Campo } from 'src/app/models/campo';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-crear-campo',
  templateUrl: './crear-campo.component.html',
})
export class CrearCampoComponent implements OnInit, OnDestroy {
  @ViewChild('closeModal') buttonClose: ElementRef;
  campoForm: FormGroup;
  identificadorControl: FormControl;
  disableGuardar$ = new BehaviorSubject<boolean>(false);
  showOpcionesSubdocumento$ = new BehaviorSubject<boolean>(false);
  showOpciones$ = new BehaviorSubject<boolean>(false);
  unsubscribe$ = new Subject<void>();
  isEdicion = false;
  @Output() campoCreado: EventEmitter<any> = new EventEmitter<any>();
  @Output() modalCerrado: EventEmitter<any> = new EventEmitter<any>();
  @Input() campo: Partial<Campo>;
  @Input() subdocumentos: any;
  editorInitObject = {
    menubar: true,
    toolbar: true,
    height: 200,
    branding: false,
  };
  tinyEditorInstance;

  constructor(private formBuilder: FormBuilder) { }

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
    this.createForm();
    this.tipoWatcher();
    this.showOpciones$.next(
      this.campoForm.get('tipo').value === 'opciones' || this.campoForm.get('tipo').value === 'boolean'
    );
    this.showOpcionesSubdocumento$.next(
      this.campoForm.get('tipo').value === 'subdocumento');
  }

  private createForm() {
    this.campoForm = this.formBuilder.group({
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

  // TODO agregar validación para que el identificador no se repita dentro del mismo documento
  onSubmit() {
    if (!this.campoForm.valid) {
      alert('Datos incompletos, complete el formulario');
      return;
    }
    /** Limpiamos las opciones vacías, si existen */
    if (this.campoForm.value.tipo === 'opciones' && this.campoForm.value.opciones) {
      this.campoForm.value.opciones = this.campoForm.value.opciones.filter((opcion) => !!opcion);
    }
    if (this.campoForm.value.tipo === 'subdocumento' && this.campoForm.value.opcionesSubdocumento) {
      this.campoForm.value.opcionesSubdocumento = this.campoForm.value.opcionesSubdocumento.map((element, index) => {
        if (index % 2 === 0) {
          if (this.campoForm.value.opcionesSubdocumento[index] && this.campoForm.value.opcionesSubdocumento[index + 1]) {
            return {
              value: element,
              subdocumento: this.campoForm.value.opcionesSubdocumento[index + 1]
            }
          }
        }
      });
      this.campoForm.value.opcionesSubdocumento = this.campoForm.value.opcionesSubdocumento.filter((opcion) => !!opcion);
    }
    this.campoCreado.emit({ campo: this.campoForm.value, esEdicion: this.isEdicion });
    this.buttonClose.nativeElement.click();
  }

  cleanForm() {
    this.modalCerrado.emit();
    this.buttonClose.nativeElement.click();
  }

  agregarOpcion() {
    this.opcionesFormArray.push(new FormControl(''));
  }

  agregarOpcionSubdocumento() {
    this.opcionesFormArraySubdocumento.push(new FormControl(''));
    this.opcionesFormArraySubdocumento.push(new FormControl(''));
  }

  handleEditorInit(event) {
    this.tinyEditorInstance = event.editor;
  }
}
