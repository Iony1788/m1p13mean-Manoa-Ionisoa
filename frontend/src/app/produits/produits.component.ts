import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProduitsService, Produit } from '../produits-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule,RouterModule   ],
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  produits: Produit[] = [];

  constructor(
    private produitsService: ProduitsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.produitsService.getProduits().subscribe({
      next: (data) => {
        this.produits = data || [];
        console.log('Produits reçus :', this.produits);
        this.cdr.detectChanges(); // force Angular à rafraîchir la vue
      },
      error: (err) => console.error('Erreur API :', err)
    });
  }




}