import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommandeService } from '../../acheteur/services/commande.service';
import { BoutiqueService } from '../services/boutique-service';
import { Boutique } from '../services/boutique.model';
import { Commande } from '../services/commande.model';
import { CommonModule } from '@angular/common';
import { MgaCurrencyPipe } from '../../pipes/mgaCurrency.pipe';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-boutique-list-commande',
  templateUrl: './boutique-list-commande.component.html',
  imports: [CommonModule, MgaCurrencyPipe],
  styleUrls: ['./boutique-list-commande.component.css']
})
export class BoutiqueListCommandeComponent implements OnInit {

  errorMessage: string = '';
  loading: boolean = false;
  commandeList: Commande[] = [];
  boutiqueConnectee: Boutique | null = null;
  backendUrl = environment.imageUrl;

  showDetailModal = false;
  detailCommande: Commande | undefined;



  constructor(
    private commandeService: CommandeService,
    private boutiqueService: BoutiqueService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadCommandeParBoutique();
  }


  loadCommandeParBoutique() {
    this.loading = true;
    this.errorMessage = '';

    this.boutiqueService.getBoutiqueConnectee().subscribe({
      next: (boutique) => {
        if (!boutique || !boutique._id) {
          this.errorMessage = "";
          this.loading = false;
          return;
        }

        this.boutiqueConnectee = boutique;

        this.commandeService.getCommandesByBoutique(boutique._id).subscribe({
          next: (commande) => {
            this.commandeList = commande;
            this.loading = false;
            this.cd.detectChanges();
          },
          error: (err) => {
            console.error('Erreur produits:', err);
            this.errorMessage = "Impossible de charger les Commandes";
            this.loading = false;
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

  detailDeCommande(_t23: Commande) {
    this.showDetailModal = true;
    this.detailCommande = { ..._t23 };
  }

  closeModal() {
   this.showDetailModal = false;
  }


}

