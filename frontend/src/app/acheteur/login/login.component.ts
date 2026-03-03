import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule]
})
export class LoginComponent {
  email = 'acheteur@test.com';
  password = '123456';
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (!this.email || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs',
      });
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        if (!res.token) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur serveur',
            text: 'Token non reçu du serveur',
          });
          return;
        }

        // 🔹 sauvegarde du rôle pour sidebar et autres
        this.authService.saveRole(res.role);

        Swal.fire({
          icon: 'success',
          title: 'Connexion réussie',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          // Redirection selon rôle
          if (res.role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else if (res.role === 'boutique') {
            this.router.navigate(['/admin/dashboardBoutique']); 
          } else {
            this.router.navigate(['/']); 
          }
        });
      },
      error: (err) => {
        const errMsg = err.error?.message || 'Impossible de se connecter';
        this.message = errMsg;

        Swal.fire({
          icon: 'error',
          title: 'Échec de la connexion',
          text: errMsg
        });
      }
    });
  }

  


}

