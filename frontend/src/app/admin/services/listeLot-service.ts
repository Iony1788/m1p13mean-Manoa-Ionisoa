import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lot } from './lotModel';


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

  private apiUrl = 'http://localhost:5000/api/lot';
  private apiUrlRemote = 'https://m1p13mean-manoa-ionisoa.onrender.com/api/lot';

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
