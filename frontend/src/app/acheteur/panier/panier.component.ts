import { Component, OnInit } from '@angular/core';
import { PanierService } from '../services/panier.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  imports: [CommonModule],
})
export class PanierComponent implements OnInit {

  produits: any[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  private backendUrl = 'https://m1p13mean-manoa-ionisoa.onrender.com';

  constructor(private panierService: PanierService) {}

  ngOnInit(): void {
    // s'abonner aux changements du panier
    this.panierService.panier$.subscribe(prods => this.produits = [...prods]);
    this.panierService.totalPrice$.subscribe(p => this.totalPrice = p);
    this.panierService.totalQuantity$.subscribe(q => this.totalQuantity = q);

    // charger le panier une première fois
    this.panierService.loadPanier();
  }
   getImageUrl(image: string): string {
    if (!image) return 'https://via.placeholder.com/200';
    return this.backendUrl + (image.startsWith('/') ? image : '/' + image);
  }

    increaseQuantity(produit: any) {
    produit.quantite = (produit.quantite || 0) + 1;
    this.calculateTotals();
    // Ici, tu peux aussi appeler ton backend pour mettre à jour la quantité
    // this.panierService.updateQuantity(produit.id, produit.quantite).subscribe();
  }

  // 🔹 Diminue la quantité d’un produit
  decreaseQuantity(produit: any) {
    if ((produit.quantite || 0) > 1) {
      produit.quantite -= 1;
      this.calculateTotals();
      // Appel backend si nécessaire
      // this.panierService.updateQuantity(produit.id, produit.quantite).subscribe();
    }
  }

    // 🔹 Calculer le total quantité et total prix
  calculateTotals() {
    this.totalQuantity = this.produits.reduce((sum, p) => sum + (Number(p.quantite) || 0), 0);
    this.totalPrice = this.produits.reduce((sum, p) => sum + ((Number(p.prix) || 0) * (Number(p.quantite) || 0)), 0);
  }

  // 🔹 Bouton Valider et Payer
  validerCommande() {
    console.log('Commande validée !', this.produits);
    alert(`Commande validée ! Total: ${this.totalPrice} Rs`);
    // Ici tu peux appeler ton backend pour créer la commande
    // this.panierService.validerCommande(this.produits).subscribe();
  }
}