import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Produit } from '../services/produit.model';
import { Boutique } from '../services/boutique.model';
import { BoutiqueService } from '../services/boutique-service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boutique-list-produit',
  templateUrl: './boutique-list-produit.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./boutique-list-produit.component.css']
})
export class BoutiqueListProduitComponent implements OnInit {

  produits: Produit[] = [];
  boutiqueConnectee: Boutique | null = null;
  errorMessage: string = '';
  loading: boolean = false;
  quantiteStock: number = 0;
  backendUrl = 'https://m1p13mean-manoa-ionisoa.onrender.com';

  constructor(
    private boutiqueService: BoutiqueService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBoutiqueEtProduits();
  }

  loadBoutiqueEtProduits() {
    this.loading = true;
    this.errorMessage = '';

    this.boutiqueService.getBoutiqueConnectee().subscribe({
      next: (boutique) => {
        if (!boutique || !boutique._id) {
          this.errorMessage = "Aucune boutique associée à cet utilisateur.";
          this.loading = false;
          this.cd.detectChanges();
          return;
        }

        this.boutiqueConnectee = boutique;
        this.cd.detectChanges();

        this.boutiqueService.getProduitsByBoutique(boutique._id).subscribe({
          next: (produits) => {
            this.produits = produits;
            this.loading = false;

            if (produits.length === 0) {
              this.errorMessage = "Vous n'avez encore aucun produit, ajoutez-en !";
            }

            this.cd.detectChanges(); 
          },
          error: (err) => {
            console.error('Erreur produits:', err);
            this.errorMessage = "Impossible de charger les produits";
            this.loading = false;
            this.cd.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Erreur boutique:', err);
        this.errorMessage = "Boutique non trouvée pour cet utilisateur";
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  getImageUrl(image: string): string {
    if (!image) return 'https://via.placeholder.com/200';
    return this.backendUrl + (image.startsWith('/') ? image : '/' + image);
  }

  
  ajouterProduit() {
    console.log("Ajouter un produit");
  }

  modifierProduit(produit: Produit) {
    console.log("Modifier produit :", produit);
  }

  supprimerProduit(produit: Produit) {
    console.log("Supprimer produit :", produit);
  }
}