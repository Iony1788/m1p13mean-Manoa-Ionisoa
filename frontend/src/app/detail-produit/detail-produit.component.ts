import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ProduitsService, Produit } from '../produits-service';

@Component({
  selector: 'app-detail-produit',
  standalone: true,              
  imports: [CommonModule, RouterModule],
  templateUrl: './detail-produit.component.html',
  styleUrls: ['./detail-produit.component.css']
})
export class DetailProduitComponent implements OnInit {

  produit: any;   

  constructor(
    private route: ActivatedRoute,     
    private produitService: ProduitsService 
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.produitService.getProduitById(id).subscribe({
        next: (data) => {
          this.produit = data;
          console.log(this.produit);
        },
        error: (err) => {
          console.error('Erreur:', err);
        }
      });
    }
  }

}
