import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PanierService } from '../panier.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  cartTotal: number = 0;

  constructor(private panierService: PanierService) {}

  ngOnInit() {
    this.panierService.total$.subscribe(total => {
      this.cartTotal = total;
    });
  }
}
