import { Component } from '@angular/core';
import { DocumentosService } from 'src/app/services/documentos.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-public-documentos',
    templateUrl: './documentos.component.html',
    styleUrls: ['./../public.css']
})
export class PublicDocumentosComponent {
    tipo: string;
    documentos: any[] = [];
    categorias: any[] = [];
    public loading = true;

    constructor(private documentosService: DocumentosService, private categoriasService: CategoriasService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.tipo = params['tipo'];
            this.getDatos();
        });
    }

    private getDatos() {
        this.categoriasService.getAllPublic().subscribe(resultado => {
            this.categorias = resultado.filter(element => element.tipo === this.tipo && !element.padre);
            this.loading = false;
        });
    }

}
