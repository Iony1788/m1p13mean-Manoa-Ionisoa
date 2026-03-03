import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AcheteurInfo {
  _id: string;
  nom: string;
  avatar?: string;
}

export interface Avis {
  _id: string;
  note: number;
  commentaire: string;
  createdAt: string;
  acheteurProfile: AcheteurInfo;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface StatsInfo {
  averageNote: number;
  totalAvis: number;
}

export interface ProductAvisResponse {
  success: boolean;
  data: {
    avis: Avis[];
    pagination: PaginationInfo;
    stats: StatsInfo;
  };
}

export interface CreateAvisResponse {
  success: boolean;
  message: string;
  data: {
    avis: Avis;
    productRating: StatsInfo;
  };
}

export interface CreateAvisRequest {
  note: number;
  commentaire: string;
}

export interface CheckUserAvisResponse {
  success: boolean;
  hasAvis: boolean;
  message: string;
  data?: {
    avis: Avis;
    peutModifier: boolean;
    peutSupprimer: boolean;
  } | {
    avis: null;
    peutAjouter: boolean;
  };
  userStats?: {
    totalAvis: number;
    noteMoyenne: number;
    avisProduits: number;
    avisBoutiques: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AvisService {
  private apiUrl = 'http://localhost:5000/api/avis'; 
  private apiUrlRemote = 'https://m1p13mean-manoa-ionisoa.onrender.com/api';

  constructor(private http: HttpClient) {}

  /**
   * Récupérer les avis d'un produit avec pagination
   */
  getProductAvis(
    produitId: string, 
    page: number = 1, 
    limit: number = 10, 
    sort: string = '-createdAt'
  ): Observable<ProductAvisResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort);

    return this.http.get<ProductAvisResponse>(
      `${this.apiUrl}/produit/${produitId}`, 
      { params }
    );
  }

  /**
   * Créer un avis sur un produit
   * Nécessite d'être authentifié en tant qu'acheteur
   */
  createProductAvis(
    produitId: string,
    avisData: CreateAvisRequest
  ): Observable<CreateAvisResponse> {
    
    // Récupérer le token d'authentification depuis le localStorage
    const token = localStorage.getItem('token');
    
    // Créer les headers avec le token
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post<CreateAvisResponse>(
      `${this.apiUrl}/produit/${produitId}`,
      avisData,
      { headers }
    );
  }

  /**
   * Mettre à jour un avis
   */
  updateAvis(
    avisId: string,
    avisData: Partial<CreateAvisRequest>
  ): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.put(
      `${this.apiUrl}/${avisId}`,
      avisData,
      { headers }
    );
  }

  /**
   * Supprimer un avis
   */
  deleteAvis(avisId: string): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.delete(
      `${this.apiUrl}/${avisId}`,
      { headers }
    );
  }

  checkUserAvis(productId: string): Observable<CheckUserAvisResponse> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<CheckUserAvisResponse>(
      `${this.apiUrl}/check/produit/${productId}`,
      { headers }
    );
  }

}