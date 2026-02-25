import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PanierService } from '../services/panier.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  cartTotal: number = 0; 

  constructor(private panierService: PanierService) {}

  ngOnInit(): void {
    this.panierService.totalQuantity$.subscribe(total => {
      this.cartTotal = total;
    });

    this.panierService.loadPanier();
  }
}