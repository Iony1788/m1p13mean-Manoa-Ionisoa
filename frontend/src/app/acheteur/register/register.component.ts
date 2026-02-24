import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {

  nom = '';
  prenom = '';
  email = '';
  password = '';
  role = 'acheteur';
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {

    // Vérification champs vides
    if (!this.nom || !this.prenom || !this.email || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs'
      });
      return;
    }

    this.authService.register(this.nom, this.prenom, this.email, this.password, this.role)
      .subscribe({
        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Inscription réussie',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/login']);
          });

        },
        error: (err) => {

          const errMsg = err.error?.message || 'Registration failed';
          this.message = errMsg;

          Swal.fire({
            icon: 'error',
            title: 'Erreur inscription',
            text: errMsg
          });
        }
      });
  }
}