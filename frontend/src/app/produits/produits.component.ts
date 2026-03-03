import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';

import { Produit, ProduitsService } from '../produits-service';
import { PanierService } from '../panier.service';
import { AvisService, Avis, PaginationInfo, StatsInfo, CreateAvisRequest  } from '../avis-service';


@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  private backendUrl = 'https://m1p13mean-manoa-ionisoa.onrender.com';
  produits: Produit[] = [];
  selectedProduct: Produit | null = null;
  quantity: number = 1;
  userId: string = 'user123'; // peut être dynamique
  showPopup: boolean = false;
  popupMessage: string = '';
  popupType: 'success' | 'error' = 'success';

    // Nouvel avis
  newReview: {
    note: number;
    commentaire: string;
  } = {
    note: 0,
    commentaire: ''
  };

  hoverRating: number = 0;

  // Propriétés pour les avis
  productAvis: Avis[] = [];
  avisPagination: PaginationInfo = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5
  };
  avisStats: StatsInfo = {
    averageNote: 0,
    totalAvis: 0
  };
  isLoadingAvis: boolean = false;
  avisError: string | null = null;

  isSubmittingAvis: boolean = false;
  
  // Options de tri
  currentSort: string = '-createdAt';
  sortOptions = [
    { value: '-createdAt', label: 'Plus récents' },
    { value: 'createdAt', label: 'Plus anciens' },
    { value: '-note', label: 'Meilleures notes' },
    { value: 'note', label: 'Moins bonnes notes' }
  ];

  userHasReviewed: boolean = false;
  userReview: Avis | null = null;
  editReviewData: {
    note: number;
    commentaire: string;
    avisId: string;
  } = {
    note: 0,
    commentaire: '',
    avisId: ''
  };

  hadAvis: boolean = false;

  Math = Math;

  constructor(
    private produitsService: ProduitsService,
    private panierService: PanierService, 
    private cdr: ChangeDetectorRef,
    private avisService: AvisService
  ) {}

  ngOnInit() {
    this.produitsService.getProduits().subscribe({
      next: (data) => {
        this.produits = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur API :', err)
    });
  }

  getImageUrl(image: string): string {
    if (!image) return 'https://via.placeholder.com/200';
    return this.backendUrl + (image.startsWith('/') ? image : '/' + image);
  }

  // Modal
  // openProductModal(product: Produit) {
  //   this.selectedProduct = product;
  //   this.quantity = 1;

  //   // Charger les avis du produit quand on ouvre le modal
  //   this.loadProductAvis(product._id, 1);
    
  //   // Réinitialiser le formulaire d'avis
  //   this.resetReviewForm();
  // }

  openProductModal(product: Produit) {
    this.selectedProduct = product;
    this.quantity = 1;
    
    // Réinitialiser les états
    this.userHasReviewed = false;
    this.userReview = null;
    this.editReviewData = {
      note: 0,
      commentaire: '',
      avisId: ''
    };
    
    this.checkUserAvis(product);
    // Charger les avis du produit
    this.loadProductAvis(product._id, 1);
    
    // Réinitialiser le formulaire d'avis
    this.resetReviewForm();
  }

  // Version 1: Avec subscribe (recommandée)
  checkUserAvis(product: Produit) {
    this.avisService.checkUserAvis(product._id).subscribe({
      next: (response) => {
        this.hadAvis = response.hasAvis;
        // Optionnel: stocker plus d'informations si nécessaire
      },
      error: (error) => {
        console.error('Erreur lors de la vérification', error);
        this.hadAvis = false; // Par défaut en cas d'erreur
      }
    });
  }

  closeModal() {
    this.selectedProduct = null;
    this.ngOnInit();
  }



  // Sélecteur quantité côté produit (liste)
  increaseQuantity(product: any) {
    product.quantity = (product.quantity || 1) + 1;
  }

  decreaseQuantity(product: any) {
    product.quantity = (product.quantity || 1) - 1;
    if (product.quantity < 1) product.quantity = 1;
  }

    // Fonction pour ajouter un produit au panier
    addToCart(produit: any, quantite: number) {
      this.panierService.addCartProduit(produit._id, quantite).subscribe({
        next: (res) => {
          console.log('Produit ajouté:', res);
          alert('Produit ajouté au panier !');
        },
        error: (err) => {
          console.error('Erreur ajout panier:', err);
          alert('Erreur lors de l’ajout au panier');
        }
      });
    }



  getStars(note: number): string {
    const fullStars = Math.floor(note);
    const halfStar = note % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
  }
  
  
  // Définir la note
  setRating(note: number) {
    this.newReview.note = note;
    console.log('Note sélectionnée:', note); // Pour déboguer
    this.cdr.detectChanges(); 
  }

    // Soumettre un avis
  // submitReview(produitId: string) {
    // if (!this.newReview.note) {
    //   this.showPopupMessage('Veuillez donner une note');
    //   return;
    // }

    // const avis: Partial<Avis> = {
    //   userId: this.userId,
    //   userName: this.userName,
    //   note: this.newReview.note,
    //   commentaire: this.newReview.commentaire || undefined,
    //   date: new Date()
    // };

    // this.produitsService.addAvis(produitId, avis).subscribe({
    //   next: (response) => {
    //     console.log('Avis ajouté:', response);
    //     this.showPopupMessage('Merci pour votre avis !');
        
    //     // Recharger le produit pour voir le nouvel avis
    //     if (this.selectedProduct) {
    //       this.produitsService.getProduitById(produitId).subscribe({
    //         next: (produit) => {
    //           this.selectedProduct = produit;
    //           // Mettre à jour aussi dans la liste
    //           const index = this.produits.findIndex(p => p._id === produitId);
    //           if (index !== -1) {
    //             this.produits[index] = produit;
    //           }
    //           this.resetReviewForm();
    //           this.cdr.detectChanges();
    //         },
    //         error: (err) => console.error('Erreur rechargement produit:', err)
    //       });
    //     }
    //   },
    //   error: (err) => {
    //     console.error('Erreur ajout avis:', err);
    //     this.showPopupMessage('Erreur lors de l\'ajout de l\'avis');
    //   }
    // });
  // }

  // Afficher un message popup
  // showPopupMessage(message: string) {
  //   this.popupMessage = message;
  //   this.showPopup = true;
  //   setTimeout(() => {
  //     this.showPopup = false;
  //   }, 3000);
  // }

  showPopupMessage(message: string, type: 'success' | 'error' = 'success') {
    this.popupMessage = message;
    this.popupType = type;
    this.showPopup = true;
    setTimeout(() => {
      this.showPopup = false;
    }, 3000);
  }

    // Charger les avis d'un produit
  // loadProductAvis(produitId: string, page: number = 1) {
  //   this.isLoadingAvis = true;
  //   this.avisError = null;

  //   this.avisService.getProductAvis(
  //     produitId, 
  //     page, 
  //     this.avisPagination.itemsPerPage, 
  //     this.currentSort
  //   ).subscribe({
  //     next: (response) => {
  //       this.productAvis = response.data.avis;
  //       this.avisPagination = response.data.pagination;
  //       this.avisStats = response.data.stats;
  //       this.isLoadingAvis = false;
  //       this.cdr.detectChanges();
  //     },
  //     error: (err) => {
  //       console.error('Erreur chargement avis:', err);
  //       this.avisError = 'Erreur lors du chargement des avis';
  //       this.isLoadingAvis = false;
  //       this.cdr.detectChanges();
  //     }
  //   });
  // }

    loadProductAvis(produitId: string, page: number = 1) {
    this.isLoadingAvis = true;
    this.avisError = null;

    this.avisService.getProductAvis(
      produitId, 
      page, 
      this.avisPagination.itemsPerPage, 
      this.currentSort
    ).subscribe({
      next: (response) => {
        this.productAvis = response.data.avis;
        this.avisPagination = response.data.pagination;
        this.avisStats = response.data.stats;
        
        // Vérifier si l'utilisateur connecté a déjà donné un avis
        this.checkUserReview();
        
        this.isLoadingAvis = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement avis:', err);
        this.avisError = 'Erreur lors du chargement des avis';
        this.isLoadingAvis = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Changer de page
  onPageChange(page: number) {
    if (this.selectedProduct) {
      this.loadProductAvis(this.selectedProduct._id, page);
    }
  }

  // Changer le tri
  onSortChange(event: any) {
    this.currentSort = event.target.value;
    if (this.selectedProduct) {
      this.loadProductAvis(this.selectedProduct._id, 1); // Retour à la page 1
    }
  }

    // Helper pour la pagination
  getPagesArray(): number[] {
    const pages: number[] = [];
    const totalPages = this.avisPagination.totalPages;
    const currentPage = this.avisPagination.currentPage;
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
      }
    }
    return pages;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }


  // Vérifier si l'utilisateur est connecté
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Vérifier si l'utilisateur est un acheteur
  get isAcheteur(): boolean {
    const userStr = localStorage.getItem('user_data');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.role === 1;
      } catch {
        return false;
      }
    }
    return false;
  }

    // Soumettre un avis
  submitReview(produitId: string) {
    // Vérifier si l'utilisateur est connecté
    if (!this.isLoggedIn) {
      this.showPopupMessage('Veuillez vous connecter pour donner un avis', 'error');
      return;
    }

    // Vérifier si l'utilisateur est un acheteur
    if (!this.isAcheteur) {
      this.showPopupMessage('Seuls les acheteurs peuvent donner des avis', 'error');
      return;
    }

    if (!this.newReview.note) {
      this.showPopupMessage('Veuillez donner une note', 'error');
      return;
    }

    this.isSubmittingAvis = true;

    const avisData: CreateAvisRequest = {
      note: this.newReview.note,
      commentaire: this.newReview.commentaire || ''
    };

    this.avisService.createProductAvis(produitId, avisData).subscribe({
      next: (response) => {
        console.log('Avis ajouté:', response);
        this.showPopupMessage('Merci pour votre avis !', 'success');
        
        // Réinitialiser le formulaire
        this.resetReviewForm();
        
        // Recharger les avis (page 1)
        this.loadProductAvis(produitId, 1);
        
        this.isSubmittingAvis = false;
      },
      error: (err) => {
        console.error('Erreur ajout avis:', err);
        
        // Gérer les différentes erreurs
        let errorMessage = 'Erreur lors de l\'ajout de l\'avis';
        
        if (err.status === 400) {
          if (err.error?.message === 'Vous avez déjà donné un avis sur ce produit') {
            errorMessage = 'Vous avez déjà donné un avis sur ce produit';
          } else {
            errorMessage = err.error?.message || 'Données invalides';
          }
        } else if (err.status === 401) {
          errorMessage = 'Veuillez vous connecter pour donner un avis';
        } else if (err.status === 403) {
          errorMessage = 'Vous devez être un acheteur pour donner un avis';
        } else if (err.status === 404) {
          errorMessage = 'Produit non trouvé';
        }
        
        this.showPopupMessage(errorMessage, 'error');
        this.isSubmittingAvis = false;
      }
    });
  }

  // Vérifier si l'utilisateur peut modifier/supprimer un avis
  canModifyAvis(avis: Avis): boolean {
    const userStr = localStorage.getItem('user_data');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Vérifier si l'utilisateur est l'auteur de l'avis
        return user.acheteurProfileId === avis.acheteurProfile._id;
      } catch {
        return false;
      }
    }
    return false;
  }

  // Supprimer un avis
  deleteAvis(avisId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      this.avisService.deleteAvis(avisId).subscribe({
        next: () => {
          this.showPopupMessage('Avis supprimé avec succès', 'success');
          if (this.selectedProduct) {
            this.loadProductAvis(this.selectedProduct._id, 1);
          }
        },
        error: (err) => {
          console.error('Erreur suppression avis:', err);
          this.showPopupMessage('Erreur lors de la suppression de l\'avis', 'error');
        }
      });
    }
  }

  // Réinitialiser le formulaire d'avis
  resetReviewForm() {
    this.newReview = {
      note: 0,
      commentaire: ''
    };
    this.hoverRating = 0;
  }

    // Vérifier si l'utilisateur a déjà donné un avis
  checkUserReview() {
    if (!this.isLoggedIn || !this.isAcheteur || !this.selectedProduct) {
      this.userHasReviewed = false;
      this.userReview = null;
      return;
    }

    const userStr = localStorage.getItem('user_data');
    if (!userStr) {
      this.userHasReviewed = false;
      this.userReview = null;
      return;
    }

    try {
      const user = JSON.parse(userStr);
      const userAcheteurProfileId = user.acheteurProfileId;
      
      // Chercher l'avis de l'utilisateur dans la liste
      this.userReview = this.productAvis.find(
        avis => avis.acheteurProfile._id === userAcheteurProfileId
      ) || null;
      
      this.userHasReviewed = !!this.userReview;
      
      // Si l'utilisateur a un avis, préparer les données pour l'édition
      if (this.userHasReviewed && this.userReview) {
        this.editReviewData = {
          note: this.userReview.note,
          commentaire: this.userReview.commentaire || '',
          avisId: this.userReview._id
        };
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'avis utilisateur:', error);
      this.userHasReviewed = false;
      this.userReview = null;
    }
  }

  // Mettre à jour un avis
  updateReview() {
    if (!this.editReviewData.avisId || !this.editReviewData.note) {
      this.showPopupMessage('Veuillez donner une note', 'error');
      return;
    }

    this.isSubmittingAvis = true;

    const updateData = {
      note: this.editReviewData.note,
      commentaire: this.editReviewData.commentaire
    };

    this.avisService.updateAvis(this.editReviewData.avisId, updateData).subscribe({
      next: (response) => {
        this.showPopupMessage('Votre avis a été mis à jour avec succès', 'success');
        
        // Recharger les avis
        if (this.selectedProduct) {
          this.loadProductAvis(this.selectedProduct._id, this.avisPagination.currentPage);
        }
        
        this.isSubmittingAvis = false;
      },
      error: (err) => {
        console.error('Erreur mise à jour avis:', err);
        
        let errorMessage = 'Erreur lors de la mise à jour de l\'avis';
        if (err.status === 403) {
          errorMessage = 'Vous n\'êtes pas autorisé à modifier cet avis';
        } else if (err.status === 404) {
          errorMessage = 'Avis non trouvé';
        }
        
        this.showPopupMessage(errorMessage, 'error');
        this.isSubmittingAvis = false;
      }
    });
  }

  // Supprimer un avis
  deleteReview() {
    if (!this.editReviewData.avisId) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer votre avis ?')) {
      this.isSubmittingAvis = true;

      this.avisService.deleteAvis(this.editReviewData.avisId).subscribe({
        next: () => {
          this.showPopupMessage('Votre avis a été supprimé avec succès', 'success');
          
          // Réinitialiser les états
          this.userHasReviewed = false;
          this.userReview = null;
          this.editReviewData = {
            note: 0,
            commentaire: '',
            avisId: ''
          };
          
          // Recharger les avis
          if (this.selectedProduct) {
            this.loadProductAvis(this.selectedProduct._id, 1);
          }
          
          this.isSubmittingAvis = false;
        },
        error: (err) => {
          console.error('Erreur suppression avis:', err);
          
          let errorMessage = 'Erreur lors de la suppression de l\'avis';
          if (err.status === 403) {
            errorMessage = 'Vous n\'êtes pas autorisé à supprimer cet avis';
          } else if (err.status === 404) {
            errorMessage = 'Avis non trouvé';
          }
          
          this.showPopupMessage(errorMessage, 'error');
          this.isSubmittingAvis = false;
        }
      });
    }
  }

  // Annuler l'édition
  cancelEdit() {
    this.userHasReviewed = false;
    this.userReview = null;
    this.editReviewData = {
      note: 0,
      commentaire: '',
      avisId: ''
    };
    this.resetReviewForm();
  }


}