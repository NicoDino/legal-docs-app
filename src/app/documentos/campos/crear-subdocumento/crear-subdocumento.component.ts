import { Component, OnInit, OnDestroy, EventEmitter, Output, ElementRef, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';
import { Documento } from 'src/app/models/documento';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crear-subdocumento',
  templateUrl: './crear-subdocumento.component.html',
})
export class CrearSubdocumentoComponent implements OnInit, OnDestroy {
  @ViewChild('closeModal') buttonClose: ElementRef;
  subdocumentoForm: FormGroup;
  identificadorControl: FormControl;
  disableGuardar$ = new BehaviorSubject<boolean>(false);
  showOpciones$ = new BehaviorSubject<boolean>(false);
  unsubscribe$ = new Subject<void>();
  isEdicion = false;
  @Output() subdocumentoCreado: EventEmitter<any> = new EventEmitter<any>();
  @Output() modalCerrado: EventEmitter<any> = new EventEmitter<any>();
  @Input() documento: Documento;

  constructor(private formBuilder: FormBuilder, private toastr: ToastrService) { }

  get opcionesFormArray() {
    return this.subdocumentoForm.get('opciones') as FormArray;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    this.subdocumentoForm = this.formBuilder.group({
      nombre: new FormControl('', [Validators.required]),
      padre: new FormControl(this.documento._id)
    });
  }

  // TODO agregar validación para que el identificador no se repita dentro del mismo documento
  onSubmit() {
    if (!this.subdocumentoForm.valid) {
      this.toastr.error('Error', 'Complete todos los campos');
      return;
    }
    this.subdocumentoCreado.emit({ subdocumento: this.subdocumentoForm.value });
    this.buttonClose.nativeElement.click();
  }

  cleanForm() {
    this.modalCerrado.emit();
    this.buttonClose.nativeElement.click();
  }
}
