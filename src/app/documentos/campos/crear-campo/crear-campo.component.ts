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
  disableGuardar$ = new BehaviorSubject<boolean>(false);
  showOpciones$ = new BehaviorSubject<boolean>(false);
  unsubscribe$ = new Subject<void>();
  isEdicion = false;
  @Output() campoCreado: EventEmitter<any> = new EventEmitter<any>();
  @Output() modalCerrado: EventEmitter<any> = new EventEmitter<any>();
  @Input() campo: Partial<Campo>;
  constructor(private formBuilder: FormBuilder) {}

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
  }

  private createForm() {
    this.campoForm = this.formBuilder.group({
      // TODO validar identificador que sea solo letras sin simbolos, porq va a ser el id en el html
      identificador: new FormControl(this.campo ? this.campo.identificador : '', [Validators.required]),
      descripcion: new FormControl(this.campo ? this.campo.descripcion : ''),
      tipo: new FormControl(this.campo ? this.campo.tipo : '', [Validators.required]),
      opciones: this.formBuilder.array(this.addOpciones()),
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
    this.showOpciones$.next(value === 'opciones' || value === 'boolean');
  }

  onSubmit() {
    if (!this.campoForm.valid) {
      alert('Datos incompletos, complete el formulario');
      return;
    }
    /** Limpiamos las opciones vacías, si existen */
    if (this.campoForm.value.tipo === 'opciones' && this.campoForm.value.opciones) {
      this.campoForm.value.opciones = this.campoForm.value.opciones.filter((opcion) => !!opcion);
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
}
