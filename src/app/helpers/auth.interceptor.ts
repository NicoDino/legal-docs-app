import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     // Get the auth token from the service.
     const authToken = this.auth.getToken();
     // Clone the request and replace the original headers with
     // cloned headers, updated with the authorization.
     const authReq = req.clone({
       headers: req.headers.set('Authorization', `Bearer ${authToken}` )
     });
     // send cloned request with header to the next handler.
     return next.handle(authReq);
  }
}
