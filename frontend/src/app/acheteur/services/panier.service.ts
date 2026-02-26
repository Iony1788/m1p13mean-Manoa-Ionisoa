import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PanierService {

  private endpoint = '/panier';
  private apiUrl = environment.apiUrl + this.endpoint;
  

  // Produits du panier
  private panierSubject = new BehaviorSubject<any[]>([]);
  panier$ = this.panierSubject.asObservable();

  // Totaux
  private totalQuantitySubject = new BehaviorSubject<number>(0);
  totalQuantity$ = this.totalQuantitySubject.asObservable();

  private totalPriceSubject = new BehaviorSubject<number>(0);
  totalPrice$ = this.totalPriceSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Ajouter un produit
  addCartProduit(produitId: string, quantite: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${produitId}/addCart`, { quantite }, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`
      })
    }).pipe(
      tap(() => this.loadPanier()), // recharge le panier après ajout
      catchError(err => throwError(() => err))
    );
  }

  // Charger le panier
  loadPanier(): void {
    this.http.get<any>(`${this.apiUrl}/listePanier`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`
      })
    }).subscribe({
      next: (res) => {
        const produits = res.data.produits || [];
        this.panierSubject.next(produits);

        // calcul des totaux
        const totalQuantity = produits.reduce((sum: number, produit: any) => sum + (Number(produit.quantite) || 0), 0);
        const totalPrice = produits.reduce((sum: number, produit: any) => sum + ((Number(produit.prix) || 0) * (Number(produit.quantite) || 0)), 0);

        this.totalQuantitySubject.next(totalQuantity);
        this.totalPriceSubject.next(totalPrice);
      },
      error: (err) => {
        console.error('Erreur récupération panier', err);
        this.panierSubject.next([]);
        this.totalQuantitySubject.next(0);
        this.totalPriceSubject.next(0);
      }
    });
  }

 
}