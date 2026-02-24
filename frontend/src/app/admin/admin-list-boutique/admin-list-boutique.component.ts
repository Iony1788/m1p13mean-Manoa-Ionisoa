import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BoutiqueService } from '../services/listeBoutique-service';
import { Boutique } from '../services/boutique.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-list-boutique',
  templateUrl: './admin-list-boutique.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./admin-list-boutique.component.css']
})
export class AdminListBoutiqueComponent implements OnInit {

  boutiques: Boutique[] = []; 

  constructor(
    private boutiqueService: BoutiqueService,
    private cd: ChangeDetectorRef // 🔹 injecte ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBoutiques();
  }

  loadBoutiques() {
    this.boutiqueService.getAllBoutiques().subscribe({
      next: (data) => {
        console.log("DATA COMPLETE:", JSON.stringify(data));
        console.log("TYPE:", typeof data);
        console.log("IS ARRAY:", Array.isArray(data));
        this.boutiques = data;

        this.cd.detectChanges(); // 🔥 force Angular à mettre à jour la vue
      },
      error: (err) => {
        console.error('Erreur complète:', err);
      }
    });
  }
}