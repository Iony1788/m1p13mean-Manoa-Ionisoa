import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lot } from './lotModel';
import { environment } from '../../../environment/environment';

export interface Boutique {
  _id: string;
  nom: string;
  adresse: string;
  telephone: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class LotService {

  private endpoint =  '/lot';
  private apiUrl = environment.apiUrl+this.endpoint;

   constructor(private http: HttpClient) {}

  getAllLots(): Observable<Lot[]> {
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`  
    });

    return this.http.get<Lot[]>(this.apiUrl + '/listlot', { headers });
  }
  
   getStats() {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  getClientStats() {
    return this.http.get<any>(`${this.apiUrl}/stats/client`);
  }
}
