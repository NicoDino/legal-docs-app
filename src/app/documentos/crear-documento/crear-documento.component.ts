import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
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
  ) { }

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
      nombre: new FormControl(''),
      descripcion: new FormControl(''),
      precio: new FormControl(''),
      categoria: new FormControl('Elija una categoria'),
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
          this.vistaEdicion = this.step !== '2';
        });
      }
    });
  }

  handleEditorInit(event) {
    this.tinyEditorInstance = event.editor;
  }

  onSubmit() {
    this.disableGuardar$.next(true);
    if (!this.documento._id) {
      this.documentosService.create(this.documentoForm.value).subscribe(
        (res: any) => {
          this.documento = res.data;
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
          this.documento = res.data;
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
      this.documento = res.data;
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
    if (!esEdicion) {
      this.camposService.create(nuevoCampo).subscribe(
        (campoCreado: Campo) => {
          // insertamos placeholder para el campo en el texto y guardamos el documento
          const idCampo = campoCreado.identificador.toLowerCase().replace(/\s/g, '_');
          // insertar este codigo \uFEFF evita que el tag agregado encierre todo el texto a continuacion
          this.tiny.editor.execCommand('mceInsertContent', false, `<span id=id_${idCampo}>__________</span>\uFEFF`);
          this.documentosService
            .update({ _id: this.documento._id, html: this.documentoForm.controls.html.value })
            .subscribe((documentoActualizado: Partial<Documento>) => {
              this.documento = documentoActualizado;
            });
          this.disableGuardar$.next(false);
        },
        () => {
          this.disableGuardar$.next(false);
        }
      );
    } else {
      nuevoCampo._id = this.campoEditado._id;
      this.camposService.update(nuevoCampo).subscribe((res) => {
        this.documentosService.getById(this.documento._id).subscribe((rta: any) => {
          this.documento = rta;
        });
      });
    }
    this.campoEditado = null;
  }

  onModalCerrado() {
    this.showModal = false;
    this.campoEditado = null;
  }

  campoSelected(i) {
    // TODO: ver si se puede resaltar sobre el campo seleccionado usando su index en el string
    // const contenido: string = this.documentoForm.controls.html.value;
    // const posicion = this.getPosition(contenido, '__________', index + 1);
  }

  getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
  }

  handleCampoEliminado(index) {
    const contenido: string = this.documentoForm.controls.html.value;
    const posicion = this.getPosition(contenido, '__________', index + 1);
    const resultado = contenido.substring(0, posicion) + contenido.substring(posicion + 10);
    this.documentoForm.controls.html.setValue(resultado);
    this.documentosService
      .update({ _id: this.documento._id, html: this.documentoForm.controls.html.value })
      .subscribe((documentoActualizado: Partial<Documento>) => {
        this.documento = documentoActualizado;
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
      console.log(resultado);
      this.categorias = resultado;
    });
  }
}
