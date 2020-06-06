import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  currentUserSubject = new BehaviorSubject<User>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  // tslint:disable-next-line: variable-name
  constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService) {}

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    return !this.jwtHelper.isTokenExpired(localStorage.getItem('token'));
  }

  login(email: string, password: string) {
    this.http.post(`${environment.apiUrl}/authenticate`, { email, password }).subscribe((response: any) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('token', response.token);
      this.currentUserSubject.next(response.user);
      this.router.navigate(['/']);
    });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
