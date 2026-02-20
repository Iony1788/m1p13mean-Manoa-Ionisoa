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

  quantity?: number;
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

  getProduitById(id: string) {
    return this.http.get<any>(`${this.apiUrlRemote}/${id}`);
  }

  addCartProduit(productId: string, userId: string, quantite: number) {
  return this.http.post<any>(`${this.apiUrlRemote}/${productId}/addCart`, {
    id_user: userId,
    quantite
  });
}


  getCart(idUser: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlRemote}/cart/${idUser}`);
  }


  


}
