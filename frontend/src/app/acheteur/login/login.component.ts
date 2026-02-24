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
  imports: [FormsModule, RouterLink,CommonModule]
})
export class LoginComponent {

  email = '';
  password = '';
  message = ''; // message inline si tu veux l'utiliser

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    // Vérification des champs vides
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

        this.authService.saveToken(res.token);

        Swal.fire({
          icon: 'success',
          title: 'Connexion réussie',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/']);
        });
      },
      error: (err) => {
        // Récupérer le message pour SweetAlert2
        const errMsg = err.error?.message || 'Impossible de se connecter';

        // Message inline si tu veux l'afficher dans le template
        this.message = errMsg;

        // Affichage pop-up
        Swal.fire({
          icon: 'error',
          title: 'Échec de la connexion',
          text: errMsg
        });
      }
    });
  }
}