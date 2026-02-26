import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Produit } from '../services/produit.model';
import { BoutiqueService } from '../services/boutique-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boutique-list-produit',
  templateUrl: './boutique-list-produit.component.html',
  styleUrls: ['./boutique-list-produit.component.css'],
  imports: [CommonModule]
  
})
export class BoutiqueListProduitComponent implements OnInit {

  produits: Produit[] = [];
  boutiqueId!: string;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private boutiqueService: BoutiqueService
  ) {}

  ngOnInit(): void {
    this.boutiqueId = this.route.snapshot.paramMap.get('id')!;
    this.loadProduits();
  }

  loadProduits() {
    this.loading = true;
    
    this.boutiqueService.getProduitsByBoutique(this.boutiqueId)
      .subscribe({
        next: (data) => {
          this.produits = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = "Impossible de charger les produits";
          this.loading = false;
        }
      });
  }

  onAddProduit() {
    // Rediriger vers une page ou ouvrir un modal pour ajouter un produit
    console.log("Ajouter un produit");
  }

  onEditProduit(produit: Produit) {
    // Rediriger vers une page ou ouvrir un modal pour modifier le produit
    console.log("Modifier le produit", produit);
  }

  onDeleteProduit(produit: Produit) {
    // Appeler le backend pour supprimer le produit
    console.log("Supprimer / Destocker le produit", produit);
  }
}