import { Component, OnInit } from '@angular/core';
import { LotService } from '../../admin/services/listeLot-service';
import { BoutiqueService } from '../services/boutique-service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ajout-location',
  templateUrl: './ajout-location.component.html',
  imports: [CommonModule],
  styleUrls: ['./ajout-location.component.css']
})
export class AjoutLocationComponent implements OnInit {

  lots: any[] = [];
  boutiqueId: string | null = null; // <-- ici l'ID de la boutique connectée

  constructor(
    private lotService: LotService,
     private boutiqueService: BoutiqueService,
  ) {}

  ngOnInit(): void {
    this.loadBoutiqueEtLots();
  }

  loadBoutiqueEtLots() {
  // 1️⃣ Récupérer la boutique connectée
  this.boutiqueService.getBoutiqueConnectee().subscribe({
    next: (boutique) => {
      if (!boutique || !boutique._id) {
        // ⚠️ juste afficher l'alerte, pas besoin de 'return'
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de récupérer la boutique connectée'
        });
        return; // seulement pour sortir du callback, pas pour retourner une valeur
      }

      this.boutiqueId = boutique._id;

      // 2️⃣ Charger les lots libres
      this.loadLots();
    },
    error: (err) => {
      console.error('Erreur boutique:', err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de récupérer la boutique connectée'
      });
    }
  });
}

  loadLots() {
    this.lotService.getAllLots().subscribe({
      next: (data: any[]) => {
        this.lots = data.filter(lot => lot.statut === 'libre');
      },
      error: (err) => console.error('Erreur récupération lots:', err)
    });
  }

  louer(idLot: string) {
  if (!this.boutiqueId) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Identifiant boutique non trouvé. Veuillez vous reconnecter.'
    });
    return; // ⚠️ ici, TypeScript veut que tu retournes quelque chose si tu déclares un type de Promise
  }

  // Retourner la Promise de Swal.fire
  return Swal.fire({
    title: "Confirmer la location ?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Oui, louer",
    cancelButtonText: "Annuler"
  }).then((result) => {
    if (!result.isConfirmed) return; // ici on retourne undefined

    console.log('Envoi location ->', { idLot, idBoutique: this.boutiqueId });

    this.lotService.louerLot(idLot, this.boutiqueId!).subscribe({
      next: (res) => {
        console.log('Réponse backend:', res);
        Swal.fire({
          icon: 'success',
          title: 'Lot loué avec succès',
          timer: 1500,
          showConfirmButton: false
        });
        this.loadLots(); // rafraîchir la liste des lots
      },
      error: (err) => {
        console.error('Erreur location:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: err.error?.message || 'Erreur serveur'
        });
      }
    });
  });
}
}