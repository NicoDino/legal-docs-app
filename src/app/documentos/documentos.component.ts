import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EventsDocumentosService } from './services/eventsDocumentos.service';
import { DocumentosService } from '../services/documentos.service';
import { Documento } from '../models/documento';
import { MdbTableDirective, MdbTablePaginationComponent } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
})
export class DocumentosComponent implements OnInit {
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild('row', { static: true }) row: ElementRef;

  elements: any = [];
  headElements = ['nombre', 'tipo', 'campos', 'valor'];
  previous: string;
  maxVisibleItems = 8;

  $documentos: Observable<Documento[]> = new Observable<Documento[]>();

  constructor(
    private documentosService: DocumentosService,
    private router: Router,
    private eventos: EventsDocumentosService,
    private cdRef: ChangeDetectorRef
  ) {}

  @HostListener('input') oninput() {}

  ngOnInit(): void {
    this.getDocumentos();
    this.eventos.documentoBorrado$.subscribe((evento) => {
      this.getDocumentos();
    });
    this.loadElements();
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(this.maxVisibleItems);
    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  private getDocumentos() {
    this.$documentos = this.documentosService.getAll();
  }

  crearDocumento() {
    this.router.navigateByUrl('crear-documento');
  }

  camposDocumento(idDocumento) {
    this.router.navigateByUrl(`crear-documento/1/${idDocumento}`);
  }

  editarContenido(idDocumento) {
    this.router.navigateByUrl(`crear-documento/2/${idDocumento}`);
  }

  borrarDocumento(idDocumento: string) {
    if (confirm('¿Está seguro de querer eliminar el documento?')) {
      this.documentosService.delete(idDocumento).subscribe((res) => {
        this.eventos.emitDocumentoBorrado();
        this.loadElements();
      });
    }
  }

  loadElements() {
    this.$documentos.subscribe((docs) => {
      this.elements = docs;
      this.mdbTable.setDataSource(this.elements);
      this.elements = this.mdbTable.getDataSource();
      this.previous = this.mdbTable.getDataSource();
    });
  }
}
