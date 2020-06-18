import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';
import { DocumentosService } from 'src/app/services/documentos.service';
import { takeUntil } from 'rxjs/operators';
import { Documento } from 'src/app/models/documento';
import { CamposService } from 'src/app/services/campos.service';
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
  documento: Partial<Documento> = {};
  vistaEdicion = false;

  editorInitObject = {
    menubar: false,
  };
  tinyEditorInstance;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private documentosService: DocumentosService,
    private camposService: CamposService,
    private route: ActivatedRoute
  ) {}

  @ViewChild('tinyEditor') tiny;

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.documentoForm = this.formBuilder.group({
      nombre: new FormControl(''),
      precio: new FormControl(''),
      tipo: new FormControl(''),
      html: new FormControl(''),
    });

    this.route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe((params) => {
      this.documento._id = params.get('idDocumento');
      if (this.documento._id) {
        this.documentosService.getById(this.documento._id).subscribe((rta: any) => {
          this.documento = rta;
          this.documentoForm.controls.nombre.setValue(rta.nombre);
          this.documentoForm.controls.precio.setValue(rta.precio);
          this.documentoForm.controls.tipo.setValue(rta.tipo);
          this.documentoForm.controls.html.setValue(rta.html);
          this.vistaEdicion = true;
        });
      }
    });
  }

  handleEditorInit(event) {
    this.tinyEditorInstance = event.editor;
  }

  onSubmit() {
    this.disableGuardar$.next(true);
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
  }

  guardarHtml() {
    this.documento.html = this.documentoForm.controls.html.value;
    this.documentosService.update(this.documento).subscribe((res: any) => {
      this.documento = res.data;
      this.onCancel();
    });
  }

  onCancel() {
    this.router.navigateByUrl('documentos');
  }

  closeModal(nuevoCampo): void {
    this.camposService.create(nuevoCampo).subscribe(
      () => {
        // insertamos placeholder para el campo en el texto y guardamos el documento
        this.tiny.editor.execCommand('mceInsertContent', false, '__________');
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
}
