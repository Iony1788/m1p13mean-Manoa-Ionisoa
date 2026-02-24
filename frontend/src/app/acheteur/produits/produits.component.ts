import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Produit, ProduitsService } from '../services/produits-service';
import { PanierService } from '../services/panier.service';



@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  private backendUrl = 'https://m1p13mean-manoa-ionisoa.onrender.com';
  produits: Produit[] = [];
  selectedProduct: Produit | null = null;
  quantity: number = 1;
  userId: string = 'user123'; // peut être dynamique
  showPopup: boolean = false;
  popupMessage: string = '';

  constructor(
    private produitsService: ProduitsService,
    private panierService: PanierService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.produitsService.getProduits().subscribe({
      next: (data) => {
        this.produits = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur API :', err)
    });
  }

  getImageUrl(image: string): string {
    if (!image) return 'https://via.placeholder.com/200';
    return this.backendUrl + (image.startsWith('/') ? image : '/' + image);
  }

  // Modal
  openProductModal(product: Produit) {
    this.selectedProduct = product;
    this.quantity = 1;
  }

  closeModal() {
    this.selectedProduct = null;
  }



  // Sélecteur quantité côté produit (liste)
  increaseQuantity(product: any) {
    product.quantity = (product.quantity || 1) + 1;
  }

  decreaseQuantity(product: any) {
    product.quantity = (product.quantity || 1) - 1;
    if (product.quantity < 1) product.quantity = 1;
  }

    // Fonction pour ajouter un produit au panier
    addToCart(produit: any, quantite: number) {
      this.panierService.addCartProduit(produit._id, quantite).subscribe({
        next: (res) => {
          console.log('Produit ajouté:', res);
          alert('Produit ajouté au panier !');
        },
        error: (err) => {
          console.error('Erreur ajout panier:', err);
          alert('Erreur lors de l’ajout au panier');
        }
      });
    }
}