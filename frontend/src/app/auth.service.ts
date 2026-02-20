import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  // LOGIN
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      email,
      password
    });
  }

  // REGISTER
  register(nom: string, prenom: string, email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      nom,
      prenom,
      email,
      password,
      role
    });
  }

  // SAVE TOKEN
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}
