import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  quantity?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProduitsService {

  private apiUrl = 'http://localhost:5000/api/produits'; 
  private apiUrlRemote = 'https://m1p13mean-manoa-ionisoa.onrender.com/api/produits';


  constructor(private http: HttpClient) { }

  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }

  getProduitById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

 




  


}
