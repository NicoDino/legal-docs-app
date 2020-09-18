import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocumentosService } from 'src/app/services/documentos.service';
import { Documento } from 'src/app/models/documento';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Borrador } from 'src/app/models/borrador';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { BorradoresService } from 'src/app/services/borradores.service';
import * as moment from 'moment';

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
  opcionesSubdocumentos: any[] = [];
  borradorForm: FormGroup;
  subdocumentosForm: any[] = [];
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

  subdocumentoActivo = false;
  subdocumentoElegido: Partial<Documento>;
  subcampoIndex = 0;
  ignorarSubdocumento = false;

  // arrays key-value con los valores de los campos
  valoresCamposArray = [];
  valoresSubcamposArray = [];
  constructor(
    private route: ActivatedRoute,
    private docService: DocumentosService,
    private formBuilder: FormBuilder,
    private borradorService: BorradoresService
  ) { }

  charControl(event) {
    var disabledCodes = [220];
    if (disabledCodes.indexOf(event.keyCode) != -1) {
      event.preventDefault();
    }
  }

  get camposFormArray() {
    return this.borradorForm.get('campos') as FormArray;
  }
  get subCamposFormArray() {
    return this.borradorForm.get('subcampos') as FormArray;
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
      subcampos: this.formBuilder.array([]),
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
        for (const campo of doc.campos) {
          if (campo.opcionesSubdocumento && campo.opcionesSubdocumento.length) {
            this.opcionesSubdocumentos = [...this.opcionesSubdocumentos, ...campo.opcionesSubdocumento];
          }
        }
        for (const opcion of this.opcionesSubdocumentos) {
          this.cargarSubCampos(opcion.subdocumento);
        }
        this.loading = false;
      });
  }

  private crearBorrador(doc: Documento) {
    this.borradorForm.get('documento').setValue(doc._id);
    doc.campos.forEach((campo) => {
      this.camposFormArray.push(new FormControl(''));
    });
  }

  private cargarSubCampos(subdoc) {
    subdoc.campos.forEach((campo) => {
      this.subCamposFormArray.push(new FormControl(''));
    });
  }

  private initInputWatcher() {
    this.camposFormArray.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$)).subscribe((value) => {
      let valor;
      if (this.documento.campos[this.campoIndex].tipo === 'date') {
        valor = moment(value[this.campoIndex]).format('DD/MM/YYYY');
      } else {
        if (this.documento.campos[this.campoIndex].tipo === 'subdocumento') {
          valor = ' ';
          // TODO: creo que esta linea de abajo puede simplificarse
          let subdoc = this.opcionesSubdocumentos.find((e) => e._id === value[this.campoIndex]._id);
          subdoc = subdoc.subdocumento;
          this.subdocumentoElegido = subdoc;
          if (subdoc.html) {
            valor = subdoc.html;
          }
          if (subdoc.campos && subdoc.campos.length) {
            this.subcampoIndex = -1;
          }
        } else {
          valor = value[this.campoIndex];
        }
      }

      this.tinyEditorInstance.dom.setHTML(
        this.tinyEditorInstance.dom.select(this.getCampoTagId(this.campoIndex)),
        valor || '__________'
      );

      this.updateArrayValores(
        this.getCampoTagId(this.campoIndex),
        valor,
        this.documento.campos[this.campoIndex].tipo === 'subdocumento'
      );
    });

    this.subCamposFormArray.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (!this.subdocumentoActivo) {
          return;
        }
        let valor;
        if (this.subdocumentoElegido.campos[this.subcampoIndex].tipo === 'date') {
          valor = moment(value[this.subcampoIndex]).format('DD/MM/YYYY');
        } else {
          valor = value[this.subcampoIndex];
        }
        this.tinyEditorInstance.dom.setHTML(
          this.tinyEditorInstance.dom.select(this.getSubCampoTagId(this.subcampoIndex)),
          valor || '__________'
        );
        this.updateArrayValoresSubcampos(this.getSubCampoTagId(this.subcampoIndex), valor);
      });
  }

  private updateArrayValores(id, valor, isSubdocumento) {
    const foundIndex = this.valoresCamposArray.findIndex((campo) => campo.id === id);
    if (foundIndex > -1) {
      this.valoresCamposArray[foundIndex] = { id, valor, isSubdocumento };
    } else {
      this.valoresCamposArray.push({ id, valor, isSubdocumento });
    }
  }
  private updateArrayValoresSubcampos(id, valor) {
    const foundIndex = this.valoresSubcamposArray.findIndex((campo) => campo.id === id);
    if (foundIndex > -1) {
      this.valoresSubcamposArray[foundIndex] = { id, valor };
    } else {
      this.valoresSubcamposArray.push({ id, valor });
    }
  }

  private getSubCampoTagId(index) {
    const idCampo = this.subdocumentoElegido.campos[index].identificador;
    return `#${idCampo}`;
  }
  private getCampoTagId(index) {
    const idCampo = this.documento.campos[index].identificador;
    return `#${idCampo}`;
  }

  getCampoSiguiente() {
    // Si el campo actual contiene un subdocumento y no está indicado ignorarlo, intentamos ingresar a los sub-campos
    if (this.documento.campos[this.campoIndex].tipo === 'subdocumento') {
      if (!this.subdocumentoElegido) {
        // Este caso se da cuando avanzamos sin elegir ningun subdocumento
        alert('Debe elegir una opción para avanzar');
      } else {
        this.subdocumentoActivo = true;
        this.getSubCampoSiguiente();
      }
    } else {
      if (this.campoIndex < this.camposFormArray.length - 1) {
        this.campoIndex++;
      } else {
        this.showDoc = false;
        this.showMailForm = true;
      }
    }
  }

  getCampoAnterior() {
    if (this.campoIndex > 0) {
      this.campoIndex--;
      // si retrocediendo un paso encontramos un campo con subdocumento, nos movemos al último campo del subdocumento
      if (this.documento.campos[this.campoIndex].tipo === 'subdocumento' && !this.ignorarSubdocumento) {
        const subdoc = this.opcionesSubdocumentos.find(
          (e) => e._id === this.camposFormArray.controls[this.campoIndex].value.subdocumento
        );
        if (subdoc && subdoc.campos && subdoc.campos.length) {
          this.subdocumentoElegido = subdoc;
          this.subcampoIndex = subdoc.campos.length;
          this.subdocumentoActivo = true;
          this.getSubCampoAnterior();
        }
      } else {
        // Es necesario desactivar el flag por si estamos retrocediendo a otros subdocumentos
        this.ignorarSubdocumento = false;
      }
    }
  }

  getSubCampoSiguiente() {
    if (this.subdocumentoElegido && this.subcampoIndex < this.subdocumentoElegido.campos.length - 1) {
      this.subcampoIndex++;
    } else {
      this.subdocumentoActivo = false;
      this.subdocumentoElegido = null;
      // En caso de que sea un subcampo el ultimo campo a elegir del documento
      if (this.campoIndex < this.camposFormArray.length - 1) {
        this.campoIndex++;
      } else {
        this.showDoc = false;
        this.showMailForm = true;
      }
    }
  }

  getSubCampoAnterior() {
    if (this.subcampoIndex > 0) {
      this.subcampoIndex--;
    } else {
      this.subdocumentoActivo = false;
      this.subcampoIndex = -1;
    }
  }

  aceptarCondiciones() {
    this.aceptoTerminos = !this.aceptoTerminos;
  }

  enviarDocumento() {
    const DTO = {
      emailCliente: this.borradorForm.value.emailCliente,
      documento: this.borradorForm.value.documento,
      createdAt: this.borradorForm.value.createdAt,
      campos: this.valoresCamposArray,
      subcampos: this.valoresSubcamposArray,
    };
    this.enviando = true;
    this.borradorService.create(DTO).subscribe(
      (res) => {
        setTimeout(() => {
          window.location.href = res;
          this.enviando = false;
          window.location.href = res;
        }, 1000);  // 4s
      },
      (error) => {
        // TODO: loguear errores
      }
    );
  }
}
