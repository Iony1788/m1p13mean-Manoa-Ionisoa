import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { PanierService } from '../services/panier.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProduitsService } from '../services/produits-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule,FormsModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  cartTotal: number = 0;
  userRole: string = '';
  total$!: Observable<number>;
  motRecherche: string = '';
  produits: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private panierService: PanierService,
    public authService: AuthService,
    public produitService: ProduitsService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.total$ = this.panierService.totalQuantity$;
  }

  ngOnInit(): void {}

  // ✅ Utiliser le service
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

 


  rechercherProduit() {
    if (!this.motRecherche.trim()) {
      this.produits = [];
      return;
    }

    this.loading = true;
    this.produitService.rechercherProduit(this.motRecherche).subscribe({
      next: (response: any) => {
        this.produits = response.produits;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erreur recherche produit :', err);
        this.errorMessage = "Impossible de récupérer les produits";
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }
}