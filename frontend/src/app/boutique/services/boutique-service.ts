import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Produit } from './produit.model';
import { Boutique } from './boutique.model';

@Injectable({
  providedIn: 'root'
})
export class BoutiqueService {

  private endpoint = '/boutiques';
  private apiUrl = environment.apiUrl + this.endpoint;

  constructor(private http: HttpClient) {}

  
  getProduitsByBoutique(id: string): Observable<Produit[]> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<Produit[]>(
      `${this.apiUrl}/listProduitBoutique/${id}`,
      { headers }
    );
  }

  updateBoutique(data: { nom?: string, adresse?: string, description?: string, telephone?: string }): Observable<Boutique> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.put<Boutique>(`${this.apiUrl}/update`, data, { headers });
  }

  getBoutiqueConnectee(): Observable<Boutique> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      return this.http.get<Boutique>(`${this.apiUrl}/me`, { headers });
    }


}