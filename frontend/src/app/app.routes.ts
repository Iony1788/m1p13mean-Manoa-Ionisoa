import { Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ProduitsComponent } from './produits/produits.component';
import { HomeComponent } from './home/home.component';
import { DetailProduitComponent } from './detail-produit/detail-produit.component';




export const routes: Routes = [
  { path: '', component: HomeComponent  },
  { path: 'produits', component: ProduitsComponent },
  { path: 'produits/:id', component: DetailProduitComponent },
];
