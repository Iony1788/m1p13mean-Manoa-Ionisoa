import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Produit } from '../services/produit.model';
import { Boutique } from '../services/boutique.model';
import { BoutiqueService } from '../services/boutique-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ProduitsService } from '../../acheteur/services/produits-service';
import { environment } from '../../../environment/environment';
import { MgaCurrencyPipe } from '../../pipes/mgaCurrency.pipe';

@Component({
  selector: 'app-boutique-list-produit',
  templateUrl: './boutique-list-produit.component.html',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MgaCurrencyPipe],
  styleUrls: ['./boutique-list-produit.component.css']
})
export class BoutiqueListProduitComponent implements OnInit {
  [x: string]: any;

  produits: Produit[] = [];
  boutiqueConnectee: Boutique | null = null;
  errorMessage: string = '';
  selectedFile!: File;
  loading: boolean = false;
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  quantiteStock: number = 0;
  // backendUrl = 'https://m1p13mean-manoa-ionisoa.onrender.com';
  backendUrl = environment.imageUrl;

  // Objet produit pour le formulaire
  nouveauProduit: {
    nom: string;
    description: string;
    prix: number;
    quantiteStock: number;
    idCategorie: string;
  } = {
      nom: '',
      description: '',
      prix: 0,
      quantiteStock: 0,
      idCategorie: ''
    };

  produitEnModification!: Produit;

  categories: any[] = [];



  constructor(
    private boutiqueService: BoutiqueService,
    private cd: ChangeDetectorRef,
    private produitService: ProduitsService
  ) { }

  ngOnInit(): void {
    this.produitService.getAllCategorie().subscribe({
      next: (categories) => {
        console.log(categories);
        this.categories = categories;
      }
    })
    this.loadBoutiqueEtProduits();
  }

  loadBoutiqueEtProduits() {
    this.loading = true;
    this.errorMessage = '';

    this.boutiqueService.getBoutiqueConnectee().subscribe({
      next: (boutique) => {
        if (!boutique || !boutique._id) {
          this.errorMessage = "Aucune boutique associée à cet utilisateur.";
          this.loading = false;
          this.cd.detectChanges();
          return;
        }

        this.boutiqueConnectee = boutique;
        this.cd.detectChanges();

        this.boutiqueService.getProduitsByBoutique(boutique._id).subscribe({
          next: (produits) => {
            this.produits = produits;
            this.loading = false;

            if (produits.length === 0) {
              this.errorMessage = "Vous n'avez encore aucun produit, ajoutez-en !";
            }

            this.cd.detectChanges();
          },
          error: (err) => {
            console.error('Erreur produits:', err);
            this.errorMessage = "Impossible de charger les produits";
            this.loading = false;
            this.cd.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Erreur boutique:', err);
        this.errorMessage = "Boutique non trouvée pour cet utilisateur";
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  getImageUrl(image: string): string {
    if (!image) return 'https://via.placeholder.com/200';
    return this.backendUrl + (image.startsWith('/') ? image : '/' + image);
  }




  supprimerProduit(produit: Produit) {
    console.log("Supprimer produit :", produit);
  }

  closeModal(): void {
    this.showAddModal = false;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }
  openAddModal(): void {
    this.showAddModal = true;
  }
  openEditModal(produit: Produit): void {
    this.produitEnModification = { ...produit };
    this.showEditModal = true;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  ajouterProduit() {
    if (!this.nouveauProduit.nom) {
      Swal.fire({ icon: 'warning', title: 'Champ requis', text: 'Le nom du produit est obligatoire !', confirmButtonColor: '#3085d6' });
      return;
    }
    if (!this.nouveauProduit.prix) {
      Swal.fire({ icon: 'warning', title: 'Champ requis', text: 'Le prix est obligatoire !', confirmButtonColor: '#3085d6' });
      return;
    }
    if (!this.nouveauProduit.idCategorie) {
      Swal.fire({ icon: 'warning', title: 'Champ requis', text: 'La catégorie est obligatoire !', confirmButtonColor: '#3085d6' });
      return;
    }

    var id_boutique = this.boutiqueConnectee?._id;
    const formData = new FormData();
    formData.append('nom', this.nouveauProduit.nom);
    formData.append('description', this.nouveauProduit.description || '');
    formData.append('prix', this.nouveauProduit.prix.toString());
    formData.append('quantiteStock', (this.nouveauProduit.quantiteStock || 0).toString());
    formData.append('idCategorie', this.nouveauProduit.idCategorie);
    formData.append('id_boutique', id_boutique!);

    if (this.selectedFile) formData.append('image', this.selectedFile);

    this.produitService.addProduitImage(formData).subscribe({
      next: (res: any) => {

        this.nouveauProduit = { nom: '', description: '', prix: 0, quantiteStock: 0, idCategorie: '' };
        this.selectedFile = undefined as any;
        this.closeModal();
        Swal.fire({ icon: 'success', title: 'Succès', text: 'Le produit a été ajouté avec succès !', showConfirmButton: false, timer: 1500 });
        this.loadBoutiqueEtProduits();
      },
      error: (err) => {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Erreur', text: "Une erreur s'est produite lors de l'ajout." });
      }
    });
  }

  modifierProduit() {


    const formData = new FormData();

    console.log("FRONTEND", this.produitEnModification);

    formData.append('_id', this.produitEnModification._id);
    formData.append('nom', this.produitEnModification.nom);
    formData.append('description', this.produitEnModification.description || '');
    formData.append('prix', this.produitEnModification.prix.toString());
    formData.append('quantiteStock', (this.produitEnModification.quantiteStock || 0).toString());
    formData.append('idCategorie', this.produitEnModification.idCategorie._id);
    formData.append('id_boutique', this.produitEnModification.id_boutique._id);

    if (this.selectedFile) formData.append('image', this.selectedFile);

    this.produitService.updateProduit(formData).subscribe({
      next: () => {
        this.loadBoutiqueEtProduits();
        Swal.fire({ icon: 'success', title: 'Succès', text: 'Le produit a été modifier avec succès !', showConfirmButton: false, timer: 1500 });
        this.showEditModal= false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Erreur', text: "Une erreur s'est produite lors du modification." });
      }
    })
  }




}