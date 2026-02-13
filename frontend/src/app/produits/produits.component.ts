import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProduitsService } from '../produits-service';

@Component({
  selector: 'app-produits',
  imports :[ CommonModule],
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {

  produits: any[] = [];

  constructor(private produitsService: ProduitsService) { }

  ngOnInit() {
    this.produitsService.getProduits().subscribe({
      next: (data) => {
        console.log("Produits reçus :", JSON.stringify(data));
        console.log("Length :", data.length);
        this.produits = data;
      },
      


      error: (err) => console.error('Erreur API :', err)
    });
  }

}
