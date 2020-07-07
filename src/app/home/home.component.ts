import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';
import { Documento } from '../models/documento';
import { DocumentosService } from '../services/documentos.service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { BorradoresService } from '../services/borradores.service';
import { Borrador } from '../models/borrador';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    users: User[] = [];
    documentos: Documento[] = [];
    borradores: Borrador[] = [];

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private documentoService: DocumentosService,
        private borradoresService: BorradoresService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        this.loadAllUsers();
        this.loadAllDocumentos();
        this.loadAllBorradores();
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }


    private loadAllUsers() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
        });
    }

    private loadAllDocumentos() {
        this.documentoService.getAll().pipe(first()).subscribe(documentos => {
            this.documentos = documentos;
        });
    }

    private loadAllBorradores() {
        this.borradoresService.getAll().pipe(first()).subscribe(borradores => {
            this.borradores = borradores;
        });
    }
}
