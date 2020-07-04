import { Component } from '@angular/core';
import { DocumentosService } from 'src/app/services/documentos.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-preview-documento',
    templateUrl: './preview-documento.component.html',
    styleUrls: ['./../../public.css']
})
export class PreviewDocumentoComponent {
    documento: any = [];
    idDocumento: string;
    public loading = true;

    constructor(private documentosService: DocumentosService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.idDocumento = params['idDocumento'];
            this.getDatos();
        });
    }

    private getDatos() {
        this.documentosService.getByIdPublic(this.idDocumento).subscribe(resultado => {
            this.documento = resultado;
            this.loading = false;
        });
    }

}
