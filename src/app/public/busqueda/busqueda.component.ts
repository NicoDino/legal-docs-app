import { Component } from '@angular/core';
import { DocumentosService } from 'src/app/services/documentos.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-public-busqueda',
    templateUrl: './busqueda.component.html',
    styleUrls: ['./../public.css']
})
export class PublicBusquedaComponent {
    busqueda: string;
    documentos: any[] = [];

    constructor(private documentosService: DocumentosService, private categoriasService: CategoriasService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.busqueda = params['busqueda'];
            this.getDatos();
        });
    }

    private getDatos() {
        this.documentosService.search(this.busqueda).subscribe(documentos => {
            this.documentos = documentos;
        });
    }

}
