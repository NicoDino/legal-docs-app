import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { User } from './models/user';
import { AuthenticationService } from './services/authentication.service';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent implements OnInit {
  currentUser: boolean;
  admin: boolean;
  constructor(private authenticationService: AuthenticationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((val) => {
      this.currentUser = this.authenticationService.isLoggedIn;
    });
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.admin = e.url.startsWith("/admin");
      }
    });
  }
}
