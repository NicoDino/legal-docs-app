import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';
import { DocumentosService } from 'src/app/services/documentos.service';
import { takeUntil } from 'rxjs/operators';
import { Documento } from 'src/app/models/documento';
import { CamposService } from 'src/app/services/campos.service';
import { Campo } from 'src/app/models/campo';
import { CrearCampoComponent } from '../campos/crear-campo/crear-campo.component';
import { CategoriasService } from 'src/app/services/categorias.service';
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
  documento: Partial<Documento> = {};
  vistaEdicion = false;
  /** utilizado para edicion de campo */
  campoEditado: Partial<Campo>;
  editorInitObject = {
    menubar: false,
  };
  tinyEditorInstance;
  showModal = false;
  step = '1';
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private documentosService: DocumentosService,
    private camposService: CamposService,
    private categoriaService: CategoriasService,
    private route: ActivatedRoute
  ) {}

  @ViewChild('tinyEditor') tiny;
  @ViewChild('openModal') openModal: ElementRef;
  @ViewChild('campoModal') campoModal: CrearCampoComponent;

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.getCategorias();
    this.documentoForm = this.formBuilder.group({
      nombre: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
      precio: new FormControl('', [Validators.required]),
      categoria: new FormControl('Elija una categoria', [Validators.required]),
      html: new FormControl(''),
    });
    this.loadDocumento();
  }

  private loadDocumento() {
    this.route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe((params) => {
      this.documento._id = params.get('idDocumento');
      this.step = params.get('step');
      if (this.documento._id) {
        this.documentosService.getById(this.documento._id).subscribe((rta: any) => {
          this.documento = rta;
          this.documentoForm.controls.nombre.setValue(rta.nombre);
          this.documentoForm.controls.precio.setValue(rta.precio);
          this.documentoForm.controls.descripcion.setValue(rta.descripcion);
          this.documentoForm.controls.categoria.setValue(rta.categoria ? rta.categoria._id : '');
          this.documentoForm.controls.html.setValue(rta.html);
          this.documento.campos.sort((a, b) => (a.posicion > b.posicion ? 1 : -1));
          this.vistaEdicion = this.step !== '2';
        });
      }
    });
  }

  handleEditorInit(event) {
    this.tinyEditorInstance = event.editor;
  }

  onSubmit() {
    if (this.documentoForm.invalid) {
      alert('Debe completar todos los campos');
      return;
    }
    this.disableGuardar$.next(true);
    if (!this.documento._id) {
      this.documentosService.create(this.documentoForm.value).subscribe(
        (res: any) => {
          this.documento = res;
          this.vistaEdicion = true;
          this.disableGuardar$.next(false);
        },
        () => {
          this.disableGuardar$.next(false);
        }
      );
    } else {
      const documentoEditado = this.documentoForm.value;
      documentoEditado._id = this.documento._id;
      this.documentosService.update(documentoEditado).subscribe(
        (res: any) => {
          this.documento = res;
          this.disableGuardar$.next(false);
        },
        () => {
          this.disableGuardar$.next(false);
        }
      );
    }
  }

  guardarHtml() {
    this.documento.html = this.documentoForm.controls.html.value;
    this.documentosService.update(this.documento).subscribe((res: any) => {
      this.documento = res;
      this.documento.campos.sort((a, b) => (a.posicion > b.posicion ? 1 : -1));

      this.onCancel();
    });
  }

  onCancel() {
    if (this.vistaEdicion) {
      this.vistaEdicion = false;
    } else {
      this.router.navigateByUrl('admin/documentos');
    }
  }

  onModalSubmit(evento): void {
    this.showModal = false;
    const nuevoCampo = evento.campo;
    const esEdicion = evento.esEdicion;
    nuevoCampo.documento = this.documento._id;
    if (esEdicion) {
      this.modificarCampo(nuevoCampo);
    } else {
      this.crearCampo(nuevoCampo);
    }
    this.campoEditado = null;
  }

  private modificarCampo(nuevoCampo: any) {
    nuevoCampo._id = this.campoEditado._id;
    this.camposService.update(nuevoCampo).subscribe((res) => {
      this.refreshDocumento();
    });
  }

  private crearCampo(nuevoCampo: any) {
    const numeroCampo = this.documento.camposInsertados ? this.documento.camposInsertados + 1 : 1;
    const identificador = `campo_${numeroCampo}`;
    // // insertar el codigo \uFEFF evita que el tag agregado encierre todo el texto a continuacion
    this.tiny.editor.execCommand(
      'mceInsertContent',
      false,
      `<span contenteditable="false"  id=${identificador}>__________</span>\uFEFF`
    );
    const contenido: string = this.tiny.editor.getContent();
    nuevoCampo.posicion = contenido.indexOf(identificador);
    nuevoCampo.identificador = identificador;
    this.documentosService
      .update({ _id: this.documento._id, html: this.documentoForm.controls.html.value })
      .subscribe((rta: Partial<Documento>) => {
        this.camposService.create(nuevoCampo).subscribe((campoCreado: Campo) => {
          this.refreshDocumento();
        });
      });
  }

  private refreshDocumento() {
    this.documentosService.getById(this.documento._id).subscribe((rta: Partial<Documento>) => {
      this.documento = rta;
      this.documento.campos.sort((a, b) => (a.posicion > b.posicion ? 1 : -1));
    });
  }

  onModalCerrado() {
    this.showModal = false;
    this.campoEditado = null;
  }

  campoSelected(i) {
    // TODO: ver si se puede resaltar sobre el campo seleccionado usando su index en el string
    // const contenido: string = this.documentoForm.controls.html.value;
  }

  handleCampoEliminado(index) {
    const contenido: string = this.documentoForm.controls.html.value;
    const campo = this.documento.campos[index];
    const posicionIdentificador = contenido.indexOf(campo.identificador);
    const posicionInicial = posicionIdentificador - 10;
    const posicionFinal = contenido.indexOf('</span>', posicionIdentificador) + 7;
    const resultado = contenido.substring(0, posicionInicial) + contenido.substring(posicionFinal);
    this.documentoForm.controls.html.setValue(resultado);
    this.documentosService
      .update({ _id: this.documento._id, html: this.documentoForm.controls.html.value })
      .subscribe((documentoActualizado: Partial<Documento>) => {
        this.documento = documentoActualizado;
        this.documento.campos.sort((a, b) => (a.posicion > b.posicion ? 1 : -1));
      });
  }

  editarCampo(campo) {
    if (!campo) {
      alert('Error: campo no encontrado ');
      return;
    }
    this.campoEditado = campo;
    this.showModal = true;
    this.openModal.nativeElement.click();
  }

  onAgregarCampo() {
    this.showModal = true;
  }

  private getCategorias() {
    this.categoriaService.getAll().subscribe((resultado) => {
      this.categorias = resultado;
    });
  }
}
