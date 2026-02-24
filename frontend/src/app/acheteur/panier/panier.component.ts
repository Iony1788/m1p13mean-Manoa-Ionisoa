// panier.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PanierService } from '../services/panier.service';
import { CommonModule } from '@angular/common';

interface PanierItem {
  nom_produit?: string;
  nom?: string;
  quantite: number;
  prix: number;
}

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css'],
  imports: [CommonModule]
})
export class PanierComponent implements OnInit {

  panier: PanierItem[] = [];
  total: number = 0;

  constructor(private panierService: PanierService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.panierService.getCartProduits().subscribe({
      next: (res) => {
        this.panier = Array.isArray(res.data) ? res.data : [];
        this.total = this.getTotal();
        this.cd.detectChanges();
        console.log('Panier récupéré:', this.panier);
      },
      error: (err) => {
        console.error('Erreur récupération panier:', err);
        this.panier = [];
      }
    });
  }

  getTotal(): number {
    if (!Array.isArray(this.panier) || this.panier.length === 0) return 0;
    return this.panier.reduce((sum, item) => sum + (item.prix || 0) * (item.quantite || 0), 0);
  }
}