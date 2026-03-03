import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LotService } from '../services/listeLot-service';
import { Lot } from '../services/lotModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-list-lot',
  templateUrl: './admin-list-lots.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./admin-list-lots.component.css']
})
export class AdminListLotComponent implements OnInit {

  lots: Lot[] = [];
  displayedLots: Lot[] = [];
  showEditModal = false;
  lotEnModification!: Lot;

  // 🔹 Modal control
  showAddModal = false;

  // 🔹 Nouveau lot
  nouveauLot: Lot = {
    nom_lot: '',
    prix_location: 0
  };

  // Pagination
  currentPage = 1;
  itemsPerPage = 4;
  totalPages = 0;

  constructor(
    private lotService: LotService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadLots();
  }

  loadLots(): void {
    this.lotService.getAllLots().subscribe({
      next: (data) => {
        this.lots = data;
        this.totalPages = Math.ceil(this.lots.length / this.itemsPerPage);
        this.updateDisplayedLots();
        this.cd.detectChanges();
      },
      error: (err) => console.error('Erreur complète:', err)
    });
  }

  updateDisplayedLots(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedLots = this.lots.slice(start, end);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedLots();
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  // 🔹 Ouvrir modal
  ouvrirModal() {
    this.showAddModal = true;
  }

  // 🔹 Fermer modal
  closeModal() {
    this.showAddModal = false;
  }

  // 🔹 Ajouter lot
  ajouter() {

    if (!this.nouveauLot.nom_lot) {
      Swal.fire({
        icon: 'warning',
        title: 'Champ requis',
        text: 'Le nom du lot est obligatoire !',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    this.lotService.ajouterLot(this.nouveauLot).subscribe({
      next: (lot) => {

        this.lots.push(lot);

        this.totalPages = Math.ceil(this.lots.length / this.itemsPerPage);
        this.updateDisplayedLots();

        this.nouveauLot = {
          nom_lot: '',
          prix_location: 0
        };

        this.closeModal();

        // ✅ SweetAlert succès
        Swal.fire({
          icon: 'success',
          title: 'Succès ',
          text: 'Le lot a été ajouté avec succès !',
          showConfirmButton: false,
          timer: 1500
        });
      },

      error: (err) => {
        console.error(err);

        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Une erreur s'est produite lors de l'ajout."
        });
      }
    });
  }

  updateLot() {

    this.lotService.modifierLot(this.lotEnModification._id!, this.lotEnModification)
      .subscribe({
        next: (updated) => {

          const index = this.lots.findIndex(l => l._id === updated._id);
          if (index > -1) {
            this.lots[index] = updated;
          }

          this.updateDisplayedLots();
          this.closeEditModal();

          Swal.fire({
            icon: 'success',
            title: 'Modifié !',
            text: 'Le lot a été modifié avec succès',
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Modification échouée'
          });
        }
      });
  }

  supprimer(lot: Lot) {
    Swal.fire({
      title: `Supprimer le lot "${lot.nom_lot}" ?`,
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.lotService.supprimerLot(lot._id!).subscribe({
          next: () => {
            this.lots = this.lots.filter(l => l._id !== lot._id);
            this.totalPages = Math.ceil(this.lots.length / this.itemsPerPage);
            this.updateDisplayedLots();

            Swal.fire({
              icon: 'success',
              title: 'Supprimé !',
              text: 'Le lot a été supprimé avec succès',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: "Impossible de supprimer le lot"
            });
          }
        });
      }
    });
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  ouvrirModalEdit(lot: Lot) {
    this.lotEnModification = { ...lot };
    this.showEditModal = true;
  }
}