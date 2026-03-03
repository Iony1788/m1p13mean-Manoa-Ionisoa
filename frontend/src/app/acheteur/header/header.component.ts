import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PanierService } from '../services/panier.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  cartTotal: number = 0;
  userRole: string = ''; // rôle actuel
  isLoggedIn: boolean = false;

  total$!: Observable<number>;
  constructor(
    private panierService: PanierService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.total$ = this.panierService.totalQuantity$;
  }

  ngOnInit(): void {

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