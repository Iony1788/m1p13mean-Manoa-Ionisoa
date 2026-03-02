import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PanierService } from '../services/panier.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  cartTotal: number = 0; 
  userRole: string = ''; // rôle actuel
  isLoggedIn: boolean = false;

  constructor(
    private panierService: PanierService,
    private authService: AuthService  
  ) {}

  ngOnInit(): void {
    // panier
    this.panierService.totalQuantity$.subscribe(total => {
      this.cartTotal = total;
    });
    this.panierService.loadPanier();

    // rôle réactif
    this.authService.role$.subscribe(role => {
      this.userRole = role;
      this.isLoggedIn = !!role; // si rôle existe, utilisateur connecté
    });
  }

  onLogout() {
    this.authService.logout();
  }
}