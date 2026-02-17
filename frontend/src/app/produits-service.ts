import { HttpClient } from '@angular/common/http';
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
}

@Injectable({
  providedIn: 'root',
})
export class ProduitsService {
  private apiUrlRemote = 'https://m1p13mean-manoa-ionisoa.onrender.com/api/produits';

  constructor(private http: HttpClient) { }

  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrlRemote);
  }
}
