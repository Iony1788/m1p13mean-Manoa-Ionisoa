// services/auth.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private apiUrl = 'http://localhost:5000/api/auth'; // Adaptez l'URL

  constructor(
      private http: HttpClient
  ) { }

  // Sauvegarder le token et les infos utilisateur
  setAuthData(token: string, userData: any): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Récupérer les infos utilisateur
  getUser(): any {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // Vérifier le rôle
  getRole(): number | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  // Vérifier si c'est un acheteur
  isAcheteur(): boolean {
    return this.getRole() === 1;
  }

  // Vérifier si c'est une boutique
  isBoutique(): boolean {
    return this.getRole() === 2;
  }

  // Vérifier si c'est un admin
  isAdmin(): boolean {
    return this.getRole() === 0;
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Récupérer le profileId
  getProfileId(): string | null {
    const user = this.getUser();
    return user ? user.profileId : null;
  }

   
  registerAcheteur(nom: string, prenom: string, email: string, password: string, photo: File): Observable<any> {
    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('prenom', prenom);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', '1');
    formData.append('name', `${prenom} ${nom}`);
    
    if (photo) {
      formData.append('photo', photo, photo.name);
    }

    return this.http.post(`${this.apiUrl}/register`, formData);
  }

  // Méthodes pour les autres rôles
  registerAdmin(nom: string, prenom: string, email: string, password: string): Observable<any> {
    const userData = {
      nom,
      prenom,
      email,
      password,
      role: '0' // 0 = Admin
    };
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  registerBoutique(nom: string, prenom: string, email: string, password: string, 
                   boutiqueName: string, address?: string, phone?: string): Observable<any> {
    const userData = {
      nom,
      prenom,
      email,
      password,
      role: '2', // 2 = Boutique
      boutiqueProfile: {
        name: boutiqueName,
        address,
        phone
      }
    };
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}