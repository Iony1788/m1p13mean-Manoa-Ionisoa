import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  private endpoint = '/commandes';
  private apiUrl = environment.apiUrl + this.endpoint;

  // ✅ Injection correcte
  constructor(private http: HttpClient) {}

  validerCommande() {
    return this.http.post(`${this.apiUrl}/valider`, {}, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`
      })
    });
  }
}