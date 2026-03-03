import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PanierService } from '../services/panier.service';
import { CommonModule } from '@angular/common';
import { CommandeService } from '../services/commande.service';
import { environment } from '../../../environment/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  imports: [CommonModule],
})
export class PanierComponent implements OnInit {

  produits: any[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  private backendUrl = environment.imageUrl;



  constructor
  (private panierService: PanierService, private commandeService: CommandeService,private cdr: ChangeDetectorRef) { }

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
  }

  // 🔹 Diminue la quantité d’un produit
  decreaseQuantity(produit: any) {
    if ((produit.quantite || 0) > 1) {
      produit.quantite -= 1;
      this.calculateTotals();
    }
  }

  // 🔹 Calculer le total quantité et total prix
  calculateTotals() {
    this.totalQuantity = this.produits.reduce((sum, p) => sum + (Number(p.quantite) || 0), 0);
    this.totalPrice = this.produits.reduce((sum, p) => sum + ((Number(p.prix) || 0) * (Number(p.quantite) || 0)), 0);
  }

 validerCommande() {

  Swal.fire({
    title: 'Confirmer la commande ?',
    text: "Voulez-vous vraiment valider cette commande ?",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, valider',
    cancelButtonText: 'Annuler'
  }).then((result) => {

    if (result.isConfirmed) {

      this.commandeService.validerCommande().subscribe({

        next: (res: any) => {

          this.produits = [];
          this.panierService.loadPanier();
          this.cdr.detectChanges();

          Swal.fire({
            icon: 'success',
            title: 'Succès ',
            text: 'Commande validée avec succès !',
            showConfirmButton: false,
            timer: 2000
          });
        },

        error: (err: any) => {
          console.error(err);

          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de la validation de la commande'
          });
        }

      });

    }

  });

}
}