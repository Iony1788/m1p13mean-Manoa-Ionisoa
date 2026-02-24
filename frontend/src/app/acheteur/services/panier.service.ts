import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service'; // 🔹 injecter AuthService
import { environment } from '../../../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class PanierService {

  private endpoint =  '/panier';
  private apiUrl = environment.apiUrl+this.endpoint;

 

  private totalSubject = new BehaviorSubject<number>(0);
  total$ = this.totalSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {} 

  // Ajouter un produit au panier
  addCartProduit(produitId: string, quantite: number): Observable<any> {

    console.log(`URRlllllllllllllllllllll ${this.apiUrl}`);
    return this.http.post(`${this.apiUrl}/${produitId}/addCart`, { quantite })
      .pipe(
        catchError(err => {
          console.error('Erreur ajout au panier:', err);
          return throwError(() => err);
        })
      );
  }

  // Récupérer le panier de l'utilisateur
  getCartProduits(): Observable<any> {
   

    return this.http.get(`${this.apiUrl}/listePanier`)
      .pipe(
        catchError(err => {
          console.error('Erreur récupération panier:', err);
          return throwError(() => err);
        })
      );
  }
}
