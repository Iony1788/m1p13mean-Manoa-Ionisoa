import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Produit, ProduitsService } from '../services/produits-service';
import { PanierService } from '../services/panier.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environment/environment';
import { MgaCurrencyPipe } from '../../pipes/mgaCurrency.pipe';


@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, RouterModule, MgaCurrencyPipe],
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  private backendUrl = environment.imageUrl;
  produits: Produit[] = [];
  selectedProduct: Produit | null = null;
  quantity: number = 1;
  userId: string = 'user123'; 
  showPopup: boolean = false;
  popupMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private produitsService: ProduitsService,
    private panierService: PanierService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
  this.isLoading = true; // 🔵 démarre le loader

  this.produitsService.getProduits().subscribe({
    next: (data) => {
      this.produits = data || [];
      this.isLoading = false; // 🔵 stop loader
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Erreur API :', err);
      this.isLoading = false; // 🔵 stop même si erreur
    }
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

    addToCart(produit: any, quantite: number) {
    this.panierService.addCartProduit(produit._id, quantite).subscribe({
      next: (res) => {
        console.log('Produit ajouté:', res);

        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Produit ajouté au panier !',
          showConfirmButton: false,
          timer: 1500
        });

      },
      error: (err) => {
        console.error('Erreur ajout panier:', err);

        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de l’ajout au panier',
          confirmButtonColor: '#d33'
        });

      }
  });
}
}