import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EventsDocumentosService } from './services/eventsDocumentos.service';
import { DocumentosService } from '../services/documentos.service';
import { Documento } from '../models/documento';

@Component({
    selector: 'app-documentos',
    templateUrl: './documentos.component.html'
})
export class DocumentosComponent implements OnInit {

    // categorias: Categoria[];
    $documentos: Observable<Documento[]> = new Observable<Documento[]>();
    constructor(private documentosService: DocumentosService, private router: Router, private eventos: EventsDocumentosService) { }

    ngOnInit(): void {
        this.getDocumentos();
        this.eventos.documentoBorrado$.subscribe(evento => { this.getDocumentos(); });
    }

    private getDocumentos() {
        this.$documentos = this.documentosService.getAll();
    }

    crearDocumento() {
        this.router.navigateByUrl('crear-documento');
    }

    crearCampo(idDocumento) {
        this.router.navigateByUrl(`crear-campo/${idDocumento}`);
    }

    borrarDocumento(idDOcumento: string) {
        if (confirm("¿Está seguro de querer eliminar el documento?")) {
            this.documentosService.delete(idDOcumento).subscribe(
                (res) => {
                    this.eventos.emitDocumentoBorrado();

                }
            );
        }
    }


}
