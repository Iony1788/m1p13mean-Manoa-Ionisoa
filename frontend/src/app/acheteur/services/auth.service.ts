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

  // ✅ BehaviorSubject pour rôle réactif
  private roleSubject = new BehaviorSubject<string>(localStorage.getItem('role') || '');
  role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient,private router: Router) {}

  // LOGIN
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);

          // 🔹 met à jour le BehaviorSubject pour tous les abonnés
          this.roleSubject.next(res.role);
        }
      })
    );
  }

  // Récupère le rôle actuel depuis le localStorage
  getUserRole(): string {
    return localStorage.getItem('role') || '';
  }

  // 🔹 Méthode pour sauvegarder un rôle manuellement
  saveRole(role: string) {
    localStorage.setItem('role', role);
    this.roleSubject.next(role);
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
    localStorage.removeItem('role');
    this.roleSubject.next(''); // mettre à jour le BehaviorSubject pour tous les abonnés

    // Rediriger vers login
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
