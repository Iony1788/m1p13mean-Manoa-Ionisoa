import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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
export class BoutiqueService {

  private endpoint =  '/boutiques';
  private apiUrl = environment.apiUrl+this.endpoint;

   constructor(private http: HttpClient) {}

  getAllBoutiques(): Observable<Boutique[]> {
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`   
    });

    return this.http.get<Boutique[]>(this.apiUrl + '/listboutiques', { headers });
  }

    

}

