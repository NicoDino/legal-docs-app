import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-fin-operacion',
    templateUrl: './fin-operacion.component.html',
    styleUrls: ['./../../public.css']
})
export class FinOperacionComponent {
    public loading = true;
    public exito;

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.exito = params['exito'] === 'exito';
            this.loading = false;
        });
    }

}
