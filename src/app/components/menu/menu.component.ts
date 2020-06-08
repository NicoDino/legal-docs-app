import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.css']
})

export class MenuComponent implements OnInit {
    message: any;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit() {
    }


    logout() {
        this.authenticationService.logout();
    }

}
