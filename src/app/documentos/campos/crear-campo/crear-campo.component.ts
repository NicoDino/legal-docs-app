import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Campo } from 'src/app/models/campo';

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
  subdocumentos: any[];
  campo: Partial<Campo>;

  /* Modal events */
  public modalCerrado: EventEmitter<any> = new EventEmitter<any>();
  public campoCreado: EventEmitter<any> = new EventEmitter<any>();

  /* Observables */
  showOpciones$ = new BehaviorSubject<boolean>(false);
  showOpcionesSubdocumento$ = new BehaviorSubject<boolean>(false);
  disableGuardar$ = new BehaviorSubject<boolean>(false);
  unsubscribe$ = new Subject<void>();

  constructor(private bsModalRef: BsModalRef, private formBuilder: FormBuilder) { }

  get opcionesSubdocumento(): FormArray {
    return this.campoForm.get('opcionesSubdocumento') as FormArray;
  }

  get opciones() {
    return this.campoForm.get('opciones') as FormArray;
  }

  get subdocumentoForm() {
    return this.formBuilder.group({
      value: [''],
      opcionSubocumento: [''],
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    console.log(this.subdocumentos)
    this.createForm();
    this.tipoWatcher();
    this.showOpciones$.next(
      this.campoForm.get('tipo').value === 'opciones' || this.campoForm.get('tipo').value === 'boolean'
    );
    this.showOpcionesSubdocumento$.next(this.campoForm.get('tipo').value === 'subdocumento');
  }

  private createForm() {
    this.campoForm = this.formBuilder.group({
      _id: [this.campo ? this.campo._id : ''],
      nombre: [this.campo ? this.campo.nombre : '', [Validators.required]],
      descripcion: [this.campo ? this.campo.descripcion : ''],
      ayuda: [this.campo ? this.campo.ayuda : ''],
      tipo: [this.campo ? this.campo.tipo : '', [Validators.required]],
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
        array.push([opcion]);
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
        const newGroup = this.formBuilder.group({
          value: [opcion.value],
          opcionSubocumento: [opcion.subdocumento._id],
        });
        array.push(newGroup);
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
    this.opciones.clear();

    this.opciones.push(new FormControl(''));
    if (value === 'boolean') {
      this.opciones.push(new FormControl(''));
    }
    if (value === 'subdocumento') {
      const newGroup = this.formBuilder.group({
        value: [''],
        opcion: [''],
      });
      this.opcionesSubdocumento.push(newGroup);
    }
    this.showOpciones$.next(value === 'opciones' || value === 'boolean');
    this.showOpcionesSubdocumento$.next(value === 'subdocumento');
  }

  handleEditorInit(event) {
    this.tinyEditorInstance = event.editor;
  }

  agregarOpcion() {
    this.opciones.push(new FormControl(''));
  }

  agregarOpcionSubdocumento() {
    this.opcionesSubdocumento.push(this.subdocumentoForm);
  }

  quitarOpcionSubdocumento(event) {

  }

  close() {
    this.modalCerrado.emit();
    this.bsModalRef.hide();
  }

  onSubmit() {
    if (!this.campoForm.valid) {
      alert('Datos incompletos, complete el formulario');
      return;
    }
    /* Limpiamos las opciones vacías, si existen */
    if (this.campoForm.value.tipo === 'opciones' && this.campoForm.value.opciones) {
      this.campoForm.value.opciones = this.campoForm.value.opciones.filter((opcion) => !!opcion);
    }

    if (this.campoForm.value.tipo === 'subdocumento' && this.campoForm.value.opcionesSubdocumento) {
      // this.campoForm.value.opcionesSubdocumento = this.campoForm.value.opcionesSubdocumento.map((element, index) => {
      //   if (index % 2 === 0) {
      //     if (
      //       this.campoForm.value.opcionesSubdocumento[index] &&
      //       this.campoForm.value.opcionesSubdocumento[index + 1]
      //     ) {
      //       return {
      //         value: element,
      //         subdocumento: this.campoForm.value.opcionesSubdocumento[index + 1],
      //       };
      //     }
      //   }
      // });
      this.campoForm.value.opcionesSubdocumento = this.campoForm.value.opcionesSubdocumento.filter(
        (opcion) => !!opcion
      );
    }

    this.campoCreado.emit({ campo: this.campoForm.value, esEdicion: this.isEdicion });
    this.bsModalRef.hide();
  }
}
