import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';
import { Documento } from '../models/documento';
import { DocumentosService } from '../services/documentos.service';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit {
  currentUser: User;

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;
  }
}
