// services/login.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:5000/api/auth/login'; // Adaptez l'URL

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  loginUser(credentials: {email: string, password: string, role: number}): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        if (response.success && response.token) {
          // Sauvegarder le token et les infos utilisateur
          this.authService.setAuthData(response.token, response.user);
        }
      })
    );
  }

  logout(): void {
    this.authService.logout();
  }
}