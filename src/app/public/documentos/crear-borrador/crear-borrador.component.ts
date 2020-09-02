import { Component, OnInit, Input, OnDestroy, HostListener } from '@angular/core';
import { DocumentosService } from 'src/app/services/documentos.service';
import { Documento } from 'src/app/models/documento';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Borrador } from 'src/app/models/borrador';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { BorradoresService } from 'src/app/services/borradores.service';
import * as moment from 'moment';
import { CheckoutService } from 'src/app/services/checkout.service';

@Component({
  selector: 'app-crear-borrador',
  templateUrl: './crear-borrador.component.html',
  styleUrls: ['./../../public.css'],
})
export class CrearBorradorComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  idDocumento: string;
  showDoc = false;
  aceptoTerminos = false;
  campoIndex = 0;
  borrador: Partial<Borrador> = {};
  documento: Partial<Documento>;
  borradorForm: FormGroup;
  enviando = false;
  editorInitObject = {
    menubar: false,
    toolbar: false,
    height: 400,
    branding: false,
  };
  tinyEditorInstance;
  editorForm: FormGroup;
  showMailForm = false;
  public loading = true;

  constructor(
    private route: ActivatedRoute,
    private docService: DocumentosService,
    private formBuilder: FormBuilder,
    private borradorService: BorradoresService
  ) { }

  get camposFormArray() {
    return this.borradorForm.get('campos') as FormArray;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleEditorInit(event) {
    this.tinyEditorInstance = event.editor;
    this.tinyEditorInstance.setMode('readonly');

    this.tinyEditorInstance.getBody().addEventListener('copy', (e) => {
      e.preventDefault();
    });
    this.tinyEditorInstance.getBody().addEventListener('cut', (e) => {
      e.preventDefault();
    });
  }

  ngOnInit(): void {
    this.borradorForm = this.formBuilder.group({
      emailCliente: '',
      documento: '',
      createdAt: new Date(),
      campos: this.formBuilder.array([]),
    });
    this.editorForm = this.formBuilder.group({
      html: this.formBuilder.control(''),
    });
    this.getParams();
  }

  private getParams() {
    this.route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe((params) => {
      this.idDocumento = params.get('idDocumento');
      this.loadDocumento(this.idDocumento);
    });
  }

  loadDocumento(idDoc) {
    this.docService
      .getByIdPublic(idDoc)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((doc) => {
        this.documento = doc;
        this.crearBorrador(doc);
        this.editorForm.get('html').setValue(doc.html);
        this.showDoc = true;
        this.initInputWatcher();
        this.loading = false;
      });
  }

  private crearBorrador(doc: Documento) {
    this.borradorForm.get('documento').setValue(doc._id);
    doc.campos.forEach((campo) => {
      this.camposFormArray.push(new FormControl(''));
    });
  }

  private initInputWatcher() {
    this.camposFormArray.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$)).subscribe((value) => {
      let valor;
      if (this.documento.campos[this.campoIndex].tipo === 'date') {
        valor = moment(value[this.campoIndex]).format('DD/MM/YYYY');
      } else {
        valor = value[this.campoIndex];
      }
      this.tinyEditorInstance.dom.setHTML(
        this.tinyEditorInstance.dom.select(this.getCampoTagId(this.campoIndex)),
        valor || '__________'
      );
    });
  }

  private getCampoTagId(index) {
    const idCampo = this.documento.campos[index].identificador;
    return `#${idCampo}`;
  }

  getCampoSiguiente() {
    if (this.campoIndex < this.camposFormArray.length - 1) {
      this.campoIndex++;
    } else {
      this.showDoc = false;
      this.showMailForm = true;
    }
  }

  getCampoAnterior() {
    if (this.campoIndex > 0) {
      this.campoIndex--;
    }
  }

  aceptarCondiciones() {
    this.aceptoTerminos = !this.aceptoTerminos;
  }

  enviarDocumento() {
    this.enviando = true;
    this.borradorService.create(this.borradorForm.value).subscribe((res) => {
      setTimeout(() => {
        this.enviando = false;
        window.location.href = res;
      }, 4000);  // 4s
    });
  }
}
