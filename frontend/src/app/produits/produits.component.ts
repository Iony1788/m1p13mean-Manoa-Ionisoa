import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Produit, ProduitsService } from '../produits-service';
import { CartService } from '../cart.service';


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
    private cartService: CartService,
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


addToCart(product: Produit, quantite?: number) {
  if (!product?._id) return;
  quantite = quantite || 1;

  this.produitsService.addCartProduit(product._id, this.userId, quantite)
    .subscribe({
      next: (res: any) => {
        // Met à jour le compteur total du panier
        this.cartService.addToCart(quantite!);

        // Popup ultra rapide
        const popup = document.createElement('div');
        popup.textContent = `"${product.nom}" ajouté (${quantite})`;
        popup.style.position = 'fixed';
        popup.style.top = '10px';
        popup.style.right = '10px';
        popup.style.background = '#c89e44';
        popup.style.color = '#fff';
        popup.style.padding = '8px 12px';
        popup.style.borderRadius = '4px';
        popup.style.zIndex = '9999';
        document.body.appendChild(popup);
        setTimeout(() => document.body.removeChild(popup), 800);

        this.closeModal();
      },
      error: (err) => {
        const popup = document.createElement('div');
        popup.textContent = `Erreur ajout panier`;
        popup.style.position = 'fixed';
        popup.style.top = '10px';
        popup.style.right = '10px';
        popup.style.background = '#f44336';
        popup.style.color = '#fff';
        popup.style.padding = '8px 12px';
        popup.style.borderRadius = '4px';
        popup.style.zIndex = '9999';
        document.body.appendChild(popup);
        setTimeout(() => document.body.removeChild(popup), 800);
      }
    });
}


  // Sélecteur quantité côté produit (liste)
  increaseQuantity(product: any) {
    product.quantity = (product.quantity || 1) + 1;
  }

  decreaseQuantity(product: any) {
    product.quantity = (product.quantity || 1) - 1;
    if (product.quantity < 1) product.quantity = 1;
  }
}
