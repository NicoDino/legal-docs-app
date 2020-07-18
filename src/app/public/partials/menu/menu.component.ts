import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'app-public-menu',
    templateUrl: './menu.component.html'
})
export class PublicMenuComponent {
    busqueda = '';
    currentUser = false;

    constructor(private authenticationService: AuthenticationService, private router: Router) {
    }

    ngOnInit(): void {
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((val) => {
            this.currentUser = this.authenticationService.isLoggedIn;
        });
    }

    buscar() {
        this.router.navigate([`/busqueda/${this.busqueda}`]);
    }
}
