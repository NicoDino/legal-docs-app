import { Component, Input } from '@angular/core';
import { DocumentosService } from 'src/app/services/documentos.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from 'src/app/models/categoria';

@Component({
    selector: 'public-item-arbol',
    templateUrl: './public-item-arbol.component.html',
    styleUrls: ['./../../public.css']
})
export class PublicItemArbolComponent {
    tipo: string;
    documentos: any[] = [];
    subcategorias: any[] = [];
    public loading = true;
    @Input() categoria: Categoria;

    constructor(private documentosService: DocumentosService, private categoriasService: CategoriasService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.getDatos();
    }

    private getDatos() {
        this.subcategorias = this.categoria.descendientes;
        this.documentosService.getAllPublic().subscribe(documentos => {
            this.documentos = documentos.filter(doc => doc.categoria === this.categoria._id && doc.html);
            this.loading = false;
        });
    }

}
