import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  private apiUrl = 'http://localhost:5000/api/boutiques';
  private apiUrlRemote = 'https://m1p13mean-manoa-ionisoa.onrender.com/api/boutiques';

   constructor(private http: HttpClient) {}

  getAllBoutiques(): Observable<Boutique[]> {
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`   
    });

    return this.http.get<Boutique[]>(this.apiUrl + '/listboutiques', { headers });
  }

    

}

