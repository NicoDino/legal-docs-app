import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DocumentosService } from 'src/app/services/documentos.service';
import { Documento } from 'src/app/models/documento';
import { takeUntil, filter, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Borrador } from 'src/app/models/borrador';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { BorradoresService } from 'src/app/services/borradores.service';

@Component({
  selector: 'app-crear-borrador',
  templateUrl: './crear-borrador.component.html',
  styleUrls: ['./crear-borrador.component.css'],
})
export class CrearBorradorComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  idDocumento: string;
  showDoc = false;
  campoIndex = 0;
  borrador: Partial<Borrador> = {};
  documento: Partial<Documento>;
  borradorForm: FormGroup;
  editorInitObject = {
    menubar: false,
    toolbar: false,
  };
  tinyEditorInstance;
  editorForm: FormGroup;
  showMailForm = false;
  constructor(
    private route: ActivatedRoute,
    private docService: DocumentosService,
    private formBuilder: FormBuilder,
    private borradorService: BorradoresService
  ) {}

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
  }

  ngOnInit(): void {
    this.borradorForm = this.formBuilder.group({
      emailCliente: '',
      documento: '',
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
      .getById(idDoc)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((doc) => {
        this.documento = doc;
        this.crearBorrador(doc);
        this.editorForm.get('html').setValue(doc.html);
        this.showDoc = true;
        this.initInputWatcher();
      });
  }

  private crearBorrador(doc: Documento) {
    this.borradorForm.get('documento').setValue(doc._id);
    doc.campos.forEach((campo) => {
      this.camposFormArray.push(new FormControl(''));
    });

    console.log(this.borradorForm.value);
  }

  private initInputWatcher() {
    this.camposFormArray.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$)).subscribe((value) => {
      this.tinyEditorInstance.dom.setHTML(
        this.tinyEditorInstance.dom.select(this.getCampoTagId(this.campoIndex)),
        value[this.campoIndex] || '__________'
      );
    });
  }

  private getCampoTagId(index) {
    const idCampo = this.documento.campos[index].identificador.toLowerCase().replace(/\s/g, '_');
    return `#id_${idCampo}`;
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

  enviarDocumento() {
    console.log(this.borradorForm.value);
    this.borradorService.create(this.borradorForm.value).subscribe((res) => {
      alert('Enviaremos el archivo a su correo');
    });
  }
}
