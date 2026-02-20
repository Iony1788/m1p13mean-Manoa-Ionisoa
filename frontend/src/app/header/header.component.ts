import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../cart.service'; // Assure-toi du chemin correct

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  cartTotal: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.total$.subscribe(total => this.cartTotal = total);
  }
}
