import { Component, OnInit, ViewChild } from '@angular/core';
import { PanierService } from '../panier.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit {

  selectedProduct: any;
  quantity: number = 1;
  panier: any = null;

  constructor(private panierService: PanierService) { }

  ngOnInit(): void {
    this.loadCart(); // on appelle la fonction ici
  }

  // Fonction pour récupérer le panier
  loadCart(): void {
    this.panierService.getCartProduits().subscribe({
      next: (res) => {
        this.panier = res.data;
        console.log('Panier récupéré:', this.panier);
      },
      error: (err) => {
        console.error('Erreur récupération panier:', err);
      }
    });
  }

  

}