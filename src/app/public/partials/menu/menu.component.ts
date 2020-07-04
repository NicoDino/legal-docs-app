import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-public-menu',
    templateUrl: './menu.component.html'
})
export class PublicMenuComponent {
    busqueda = '';

    constructor(private router: Router) { }

    buscar() {
        this.router.navigate([`/busqueda/${this.busqueda}`]);
    }
}
