import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { User } from './models/user';
import { AuthenticationService } from './services/authentication.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent implements OnInit {
  currentUser: boolean;

  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((val) => {
      this.currentUser = this.authenticationService.isLoggedIn;
    });
  }
}
