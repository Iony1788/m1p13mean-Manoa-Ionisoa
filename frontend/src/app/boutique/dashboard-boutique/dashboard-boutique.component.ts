import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-boutique-dashboard',
  templateUrl: './dashboard-boutique.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class DashboardBoutiqueComponent implements OnInit {

  role = 'boutique';

  totalProduits = 0;
  produitsEnStock = 0;
  produitsRupture = 0;

  ventesMois = 0;
  revenusMois = 0;

  totalClients = 0;
  nouveauxClients = 0;

  promosActives = 0;
  promosExpire = 0;

  constructor() {}

  ngOnInit() {
    this.loadMockData();
  }

  loadMockData() {
    // -------------------- Produits --------------------
    this.totalProduits = 120;
    this.produitsEnStock = 95;
    this.produitsRupture = 25;

    // -------------------- Ventes --------------------
    this.ventesMois = 78;
    this.revenusMois = 5420; // € par exemple

    // -------------------- Clients --------------------
    this.totalClients = 230;
    this.nouveauxClients = 18;

    // -------------------- Promotions --------------------
    this.promosActives = 5;
    this.promosExpire = 2;
  }
}