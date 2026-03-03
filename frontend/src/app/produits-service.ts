import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; //

export interface Boutique {
  _id: string;
  nom: string;
  adresse: string;
}

export interface Categorie {
  _id: string;
  nom: string;
  description: string;
}

export interface Produit {
  _id: string;
  nom: string;
  description: string;
  prix: number;
  image: string;
  disponible: boolean;
  quantiteStock: number;
  id_boutique?: Boutique;
  idCategorie?: Categorie;

  noteMoyenne?: number;
  nombreAvis?: Avis[];

}

export interface Avis {
  _id?: string;
  userId: string;
  userName?: string;
  note: number; // 1-5
  commentaire?: string;
  date: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  count: number;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ProduitsService {

  private apiUrl = 'http://localhost:5000/api/produits'; 
  private apiUrlRemote = 'https://m1p13mean-manoa-ionisoa.onrender.com/api/produits';


  constructor(private http: HttpClient) { }

  getProduits(): Observable<Produit[]> {
    // return this.http.get<Produit[]>(this.apiUrl);
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.data)
    );

  }

  getProduitById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

 




}
