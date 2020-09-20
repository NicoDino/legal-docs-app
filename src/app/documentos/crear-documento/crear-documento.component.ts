import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';
import { DocumentosService } from 'src/app/services/documentos.service';
import { Documento } from 'src/app/models/documento';
import { CamposService } from 'src/app/services/campos.service';
import { Campo } from 'src/app/models/campo';
import { CategoriasService } from 'src/app/services/categorias.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeUntil } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CrearCampoComponent } from '../campos/crear-campo/crear-campo.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crear-documento',
  templateUrl: './crear-documento.component.html',
  styleUrls: ['crear-documento.component.css'],
})
export class CrearDocumentoComponent implements OnInit, OnDestroy {
  documentoForm: FormGroup;
  disableGuardar$ = new BehaviorSubject<boolean>(false);
  unsubscribe$ = new Subject<void>();
  currentTab = 0;
  categorias: any[] = [];
  subdocumentos: any[] = [];
  documento: Partial<Documento> = {};
  documentoPrincipal: Partial<Documento> = {};
  selectedDocument: any = null;
  vistaEdicion = false;
  camposFiltrados = [];
  buscadorCampo = '';
  /** utilizado para edicion de campo */
  subdocumentoEditado: Partial<Documento>;
  editorInitObject = {
    menubar: false,
    branding: false,
    language: 'es',
    height: '600',
    style_formats: [
      {
        title: 'No disponible',
        inline: 'span',
        styles: { filter: 'blur(6px)', 'user-select': 'none' },
      },
      {
        title: 'Encabezados',
        items: [
          { title: 'Encabezado 1', format: 'h1' },
          { title: 'Encabezado 2', format: 'h2' },
          { title: 'Encabezado 3', format: 'h3' },
          { title: 'Encabezado 4', format: 'h4' },
          { title: 'Encabezado 5', format: 'h5' },
          { title: 'Encabezado 6', format: 'h6' },
        ],
      },
      {
        title: 'Estilos',
        items: [
          { title: 'Negrita', icon: 'bold', format: 'bold' },
          { title: 'Cursiva', icon: 'italic', format: 'italic' },
          { title: 'Subrayado', icon: 'underline', format: 'underline' },
          { title: 'Tachado', icon: 'strikethrough', format: 'strikethrough' },
          { title: 'Superíndice', icon: 'superscript', format: 'superscript' },
          { title: 'Subíndice', icon: 'subscript', format: 'subscript' },
        ],
      },
      {
        title: 'Alinear',
        items: [
          { title: 'Izquierda', icon: 'alignleft', format: 'alignleft' },
          { title: 'Centro', icon: 'aligncenter', format: 'aligncenter' },
          { title: 'Derecha', icon: 'alignright', format: 'alignright' },
          { title: 'Justificar', icon: 'alignjustify', format: 'alignjustify' },
        ],
      },
    ],
  };
  tinyEditorInstance;
  showModalSubdocumento = false;
  step = '1';
  tinyBookmark;
  idCampoSeleccionado = '';
  bsModalRef: BsModalRef;

  // loading flags
  public loading = true;
  public editorLoaded = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private documentosService: DocumentosService,
    private camposService: CamposService,
    private categoriaService: CategoriasService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) { }

  @ViewChild('tinyEditor') tiny;
  @ViewChild('openModal') openModal: ElementRef;

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getCategorias();
    this.documentoForm = this.formBuilder.group({
      nombre: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
      precio: new FormControl('', [Validators.required]),
      hojasDesde: new FormControl('', [Validators.required]),
      hojasHasta: new FormControl('', [Validators.required]),
      categoria: new FormControl('Elija una categoria', [Validators.required]),
      html: new FormControl(''),
    });
    this.loadDocumento();
  }

  private loadDocumento() {
    if (this.selectedDocument) {
      this.documento._id = this.selectedDocument._id;
      if (this.documento._id) {
        this.documentosService.getById(this.documento._id).subscribe((rta: any) => {
          this.spinner.hide();
          this.documento = rta;
          this.documentoForm.controls.nombre.setValue(rta.nombre);
          this.documentoForm.controls.precio.setValue(rta.precio);
          this.documentoForm.controls.hojasDesde.setValue(rta.hojasDesde);
          this.documentoForm.controls.hojasHasta.setValue(rta.hojasHasta);
          this.documentoForm.controls.descripcion.setValue(rta.descripcion);
          this.documentoForm.controls.categoria.setValue(rta.categoria ? rta.categoria._id : '');
          this.documentoForm.controls.html.setValue(rta.html);
          this.documento.campos.sort((a, b) => (a.posicion > b.posicion ? 1 : -1));
          this.camposFiltrados = this.documento.campos;
          this.buscadorCampo = '';
          this.vistaEdicion = this.step !== '1';
          this.loading = false;
        });
      } else {
        this.spinner.hide();
        this.loading = false;
      }
    } else {
      this.route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe((params) => {
        this.documento._id = params.get('idDocumento');
        this.step = params.get('step');
        if (this.documento._id) {
          this.documentosService.getById(this.documento._id).subscribe((rta: any) => {
            this.spinner.hide();
            this.documento = rta;
            this.documentoPrincipal = this.documento;
            this.documentoForm.controls.nombre.setValue(rta.nombre);
            this.documentoForm.controls.precio.setValue(rta.precio);
            this.documentoForm.controls.hojasDesde.setValue(rta.hojasDesde);
            this.documentoForm.controls.hojasHasta.setValue(rta.hojasHasta);
            this.documentoForm.controls.descripcion.setValue(rta.descripcion);
            this.documentoForm.controls.categoria.setValue(rta.categoria ? rta.categoria._id : '');
            this.documentoForm.controls.html.setValue(rta.html);
            this.documento.campos.sort((a, b) => (a.posicion > b.posicion ? 1 : -1));
            this.camposFiltrados = this.documento.campos;
            this.buscadorCampo = '';
            this.vistaEdicion = this.step !== '1';
            this.loadSubdocumentos();
            this.loading = false;
          });
        } else {
          this.spinner.hide();
          this.loading = false;
        }
      });
    }
  }

  private loadSubdocumentos() {
    this.documentosService.getAllSubdocumentos(this.documento._id).subscribe((rta: any) => {
      this.subdocumentos = rta;
    });
  }

  handleEditorInit(event) {
    this.tinyEditorInstance = event.editor;
    this.editorLoaded = true;
  }

  onSubmit(salir) {
    if (this.documentoForm.invalid) {
      this.toastr.error('Error', 'Complete todos los campos');
      return;
    }
    this.spinner.show();
    this.disableGuardar$.next(true);
    if (!this.documento._id) {
      this.documentosService.create(this.documentoForm.value).subscribe(
        (res: any) => {
          this.documento = res;
          this.vistaEdicion = true;
          this.disableGuardar$.next(false);
          this.spinner.hide();
          if (salir) {
            this.router.navigate(['/admin/documentos']);
          }
        },
        () => {
          this.spinner.hide();
          this.disableGuardar$.next(false);
        }
      );
    } else {
      const documentoEditado = this.documentoForm.value;
      documentoEditado._id = this.documento._id;
      this.documentosService.update(documentoEditado).subscribe(
        (res: any) => {
          this.spinner.hide();
          this.documento = res;
          this.disableGuardar$.next(false);
          if (salir) {
            this.router.navigate(['/admin/documentos']);
          }
        },
        () => {
          this.spinner.hide();
          this.disableGuardar$.next(false);
        }
      );
    }
  }

  guardarHtml(salir) {
    this.spinner.show();
    this.documento.html = this.documentoForm.controls.html.value;
    this.documentosService.update(this.documento).subscribe(
      (res: any) => {
        this.spinner.hide();
        this.documento = res;
        this.documento.campos.sort((a, b) => (a.posicion > b.posicion ? 1 : -1));
        if (salir) {
          this.router.navigate(['/admin/documentos']);
        }
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  onCancel() {
    this.router.navigateByUrl('admin/documentos');
  }

  private modificarCampo(nuevoCampo: any) {
    this.spinner.show();

    // nuevoCampo._id = this.campoEditado._id;
    this.camposService.update(nuevoCampo).subscribe(
      (res) => {
        this.spinner.hide();
        this.refreshDocumento();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  private crearCampo(nuevoCampo: any) {
    const numeroCampo = this.documento.camposInsertados ? this.documento.camposInsertados + 1 : 1;
    const identificador = `campo_${numeroCampo}_${this.documento._id}`;
    // // insertar el codigo \uFEFF evita que el tag agregado encierre todo el texto a continuacion
    this.tiny.editor.execCommand(
      'mceInsertContent',
      false,
      `<span contenteditable="false" id=${identificador}>__________</span>\uFEFF`
    );
    const contenido: string = this.tiny.editor.getContent();
    nuevoCampo.posicion = contenido.indexOf(identificador);
    nuevoCampo.identificador = identificador;
    this.spinner.show();
    this.documentosService.update({ _id: this.documento._id, html: this.documentoForm.controls.html.value }).subscribe(
      (rta: Partial<Documento>) => {
        this.camposService.create(nuevoCampo).subscribe((campoCreado: Campo) => {
          this.refreshDocumento();
        });
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  private refreshDocumento() {
    this.spinner.show();
    this.documentosService.getById(this.documento._id).subscribe(
      (rta: Partial<Documento>) => {
        this.documento = rta;
        this.documento.campos.sort((a, b) => (a.posicion > b.posicion ? 1 : -1));
        this.camposFiltrados = this.documento.campos;
        this.buscadorCampo = '';
        this.spinner.hide();
        this.tinyEditorInstance.focus();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  resaltarEnDocumento(campo) {
    const newNode = this.tinyEditorInstance.dom.select('#' + campo.identificador);
    this.tinyEditorInstance.selection.select(newNode[0]);
  }

  handleEliminar(campo) {
    const newNode = this.tinyEditorInstance.dom.select('#' + campo.identificador);
    this.tinyEditorInstance.selection.select(newNode[0]);
    this.tinyEditorInstance.selection.getNode().remove();
    this.spinner.show();
    this.documentosService.update({ _id: this.documento._id, html: this.documentoForm.controls.html.value }).subscribe(
      (documentoActualizado: Partial<Documento>) => {
        this.documento = documentoActualizado;
        this.documento.campos.sort((a, b) => (a.posicion > b.posicion ? 1 : -1));
        this.camposFiltrados = this.documento.campos;
        this.buscadorCampo = '';
        this.spinner.hide();
        this.tinyEditorInstance.focus();
        this.tinyEditorInstance.selection.moveToBookmark(this.tinyBookmark);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  agregarCampo() {
    const initialState = {
      subdocumentos: this.subdocumentos,
    };

    this.bsModalRef = this.modalService.show(CrearCampoComponent, { initialState });

    this.bsModalRef.content.campoCreado.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.onModalSubmit(res);
    });

    this.bsModalRef.content.modalCerrado.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.onModalCerrado();
    });
  }

  editarCampo(campo) {
    if (!campo) {
      this.toastr.error('Error', 'Campo no encontrado');
      return;
    }

    const initialState = {
      subdocumentos: this.subdocumentos,
      campo,
    };

    this.bsModalRef = this.modalService.show(CrearCampoComponent, { initialState });

    this.bsModalRef.content.campoCreado.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.onModalSubmit(res);
    });
    this.bsModalRef.content.modalCerrado.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.onModalCerrado();
    });
  }

  onModalSubmit(evento): void {
    const nuevoCampo = evento.campo;
    const esEdicion = evento.esEdicion;
    nuevoCampo.documento = this.documento._id;
    if (esEdicion) {
      this.modificarCampo(nuevoCampo);
    } else {
      this.crearCampo(nuevoCampo);
    }
  }

  onModalSubdocumentoSubmit(evento): void {
    this.documentosService.create(evento.subdocumento).subscribe((res: any) => {
      this.loadSubdocumentos();
    });
    this.showModalSubdocumento = false;
  }

  onModalCerrado() {
    this.showModalSubdocumento = false;
    this.subdocumentoEditado = null;
    setTimeout(() => {
      this.tinyEditorInstance.focus();
    }, 500);
  }

  onAgregarSubdocumento() {
    this.showModalSubdocumento = true;
  }

  private getCategorias() {
    this.categoriaService.getAll().subscribe((resultado) => {
      this.categorias = resultado;
    });
  }

  filtrar() {
    this.camposFiltrados = this.documento.campos.filter(
      (element) => element.nombre.toUpperCase().search(this.buscadorCampo.toUpperCase()) !== -1
    );
  }

  handleSelection(event) {
    this.idCampoSeleccionado = event.editor.selection.getNode().id;
  }

  handleDocumentChange(event) {
    if (confirm('Recuerde hacer click en GUARDAR antes de moverse de subdocumento.')) {
      this.loadDocumento();
    }
  }
}
