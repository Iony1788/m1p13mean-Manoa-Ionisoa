import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private endpoint = '/auth';
  private apiUrl = environment.apiUrl + this.endpoint;

  // 🔹 Rôle réactif
  private roleSubject = new BehaviorSubject<string>(localStorage.getItem('role') || '');
  role$ = this.roleSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // ✅ LOGIN
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          this.roleSubject.next(res.role);
        }
      })
    );
  }

  // ✅ REGISTER
  register(nom: string, prenom: string, email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      nom,
      prenom,
      email,
      password,
      role
    });
  }

  // ✅ TOKEN
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  // ✅ ROLE
  getUserRole(): string {
    return localStorage.getItem('role') || '';
  }

  saveRole(role: string) {
    localStorage.setItem('role', role);
    this.roleSubject.next(role);
  }

  // ✅ LOGOUT (VERSION UNIQUE)
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.roleSubject.next('');
    this.router.navigate(['/login']);
  }

  // ✅ CHECK LOGIN
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}