import { Routes } from '@angular/router';
import { MainLayoutComponent } from './acheteur/layouts/main-layout/main-layout.component';
import { HomeComponent } from './acheteur/home/home.component';
import { ProduitsComponent } from './acheteur/produits/produits.component';
import { PanierComponent } from './acheteur/panier/panier.component';
import { AuthLayoutComponent } from './acheteur/layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './acheteur/login/login.component';
import { RegisterComponent } from './acheteur/register/register.component';
import { LoginAdminComponent } from './admin/login-admin/login-admin.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { BoutiqueListProduitComponent } from './boutique/boutique-list-produit/boutique-list-produit.component';
import { BoutiqueListCommandeComponent } from './boutique/boutique-list-commande/boutique-list-commande.component';
import { BoutiqueInfoComponent } from './boutique/boutique-info/boutique-info.component';
import { AjoutPromotionComponent } from './boutique/ajout-promotion/ajout-promotion.component';
import { AdminListBoutiqueComponent } from './admin/admin-list-boutique/admin-list-boutique.component';
import { AdminListLotComponent } from './admin/admin-list-lots/admin-list-lots.component';
import { DashboardBoutiqueComponent } from './boutique/dashboard-boutique/dashboard-boutique.component';
import { AjoutLocationComponent } from './boutique/ajout-location/ajout-location.component';

export const routes: Routes = [

  //ACHETEUR
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'produits', component: ProduitsComponent },     
      { path: 'panier', component: PanierComponent }, 
      
    ]
  },


  //AUTHENTIFICATION
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'admin-login', component: LoginAdminComponent }
   
    ]
  },

  //ADMIN
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      
      { path: 'list-boutique', component: AdminListBoutiqueComponent },

      { path: 'list-produit', component: BoutiqueListProduitComponent },

      { path: 'list-commande', component: BoutiqueListCommandeComponent },

      { path: 'list-lot', component: AdminListLotComponent},

      { path: 'boutique-info', component: BoutiqueInfoComponent },

      { path: 'ajout-promotion', component: AjoutPromotionComponent },

      { path: 'dashboardBoutique', component: DashboardBoutiqueComponent },

      { path: 'ajout-location', component: AjoutLocationComponent }
      
    ]
  },
];


