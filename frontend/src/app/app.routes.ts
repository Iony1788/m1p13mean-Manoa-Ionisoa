import { Routes } from '@angular/router';

import { AcheteurRegister } from './components/auth/acheteur-register/acheteur-register';
import { AdminRegister } from './components/auth/admin-register/admin-register';
import { BoutiqueRegister } from './components/auth/boutique-register/boutique-register';
import { Login } from './components/auth/login/login';
import { LoginAdmin } from './components/auth/login-admin/login-admin';
import { LoginBoutique } from './components/auth/login-boutique/login-boutique';

export const routes: Routes = [
    { path: 'register/acheteur', component: AcheteurRegister },
    { path: 'register/admin', component: AdminRegister },
    { path: 'register/boutique', component: BoutiqueRegister },
    { path: 'login/acheteur', component: Login },
    { path: 'login/boutique', component: LoginBoutique },
    { path: 'login/admin', component: LoginAdmin },
];
