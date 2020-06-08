import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  getAll() {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getById(id: string) {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  register(user: User) {
    return this.http.post(`${this.apiUrl}/users/register`, user);
  }

  update(user: User) {
    return this.http.put(`${this.apiUrl}/users/${user.id}`, user);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  changePass(id: string, update) {
    return this.http.post(`${this.apiUrl}/users/${id}/change_password`, update);
  }

  requestToken(email: string) {
    return this.http.post(`${this.apiUrl}/users/request_token`, { email });
  }

  resetPass(params){
    return this.http.post(`${this.apiUrl}/users/password_reset`, params );

  }
}
