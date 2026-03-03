import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CommandeService {

    private endpoint = '/commandes';
    private apiUrl = environment.apiUrl + this.endpoint;

    // ✅ Injection correcte
    constructor(private http: HttpClient) { }

    validerCommande() {
        return this.http.post(`${this.apiUrl}/valider`, {}, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${localStorage.getItem('token')}`
            })
        });
    }


    getCommandesByBoutique(boutiqueId: string): Observable<any[]> {
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.get<any[]>(`${this.apiUrl}/boutique/${boutiqueId}`, { headers });
    }
}