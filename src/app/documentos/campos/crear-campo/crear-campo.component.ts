import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';
import { Documento } from 'src/app/models/documento';

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
  opcionesFormArray: FormArray;
  @Input() documento: Documento;
  @Output() campoCreado: EventEmitter<any> = new EventEmitter<any>();

  constructor(private router: Router, private formBuilder: FormBuilder) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.campoForm = this.formBuilder.group({
      identificador: new FormControl('', [Validators.required]),
      descripcion: new FormControl(''),
      tipo: new FormControl('', [Validators.required]),
      documento: new FormControl(this.documento._id, [Validators.required]),
      opciones: new FormArray([new FormControl('')]),
    });
    this.opcionesFormArray = this.campoForm.controls.opciones as FormArray;
    this.campoForm.controls.tipo.valueChanges.subscribe((value) => {
      this.showOpciones$.next(value === 'opciones');
    });
  }

  onSubmit() {
    if (!this.campoForm.valid) {
      alert('Datos incompletos, complete el formulario');
      return;
    }
    this.campoCreado.emit(this.campoForm.value);
    this.buttonClose.nativeElement.click();
  }

  onCancel() {
    this.router.navigateByUrl('documentos');
  }

  agregarOpcion() {
    this.opcionesFormArray = this.campoForm.get('opciones') as FormArray;
    this.opcionesFormArray.push(new FormControl(''));
  }
}
