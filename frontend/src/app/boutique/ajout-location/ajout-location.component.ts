import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  boutiqueId: string | null = null;

  constructor(
    private lotService: LotService,
    private boutiqueService: BoutiqueService,
    private cdr: ChangeDetectorRef   // ✅ ajout ici
  ) {}

  ngOnInit(): void {
    this.loadBoutiqueEtLots();
  }

  loadBoutiqueEtLots() {
    this.boutiqueService.getBoutiqueConnectee().subscribe({
      next: (boutique) => {
        if (!boutique || !boutique._id) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible de récupérer la boutique connectée'
          });
          return;
        }

        this.boutiqueId = boutique._id;
        this.loadLots();

        this.cdr.detectChanges(); // ✅ forcer refresh
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
        this.cdr.detectChanges(); // ✅ refresh après update lots
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
      return;
    }

    return Swal.fire({
      title: "Confirmer la location ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui, louer",
      cancelButtonText: "Annuler"
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.lotService.louerLot(idLot, this.boutiqueId!).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Lot loué avec succès',
            timer: 1500,
            showConfirmButton: false
          });

          this.loadLots();
          this.cdr.detectChanges(); // ✅ forcer update UI
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