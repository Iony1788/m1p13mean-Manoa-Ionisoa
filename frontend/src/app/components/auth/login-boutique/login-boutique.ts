import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from "../../../services/login.service";
import { AuthService } from "../../../services/auth.service";
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-login-boutique',
  imports: [FormsModule, CommonModule],
  templateUrl: './login-boutique.html',
  styleUrl: './login-boutique.css',
})
export class LoginBoutique {
  user = { email: '', password: '', role: 2 };
  isLoading = false;

  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router
  ) { }

  login(): void {
    if (this.user.email && this.user.password) {
      this.isLoading = true;
      
      this.loginService.loginUser(this.user).subscribe(
        (response) => {
          if (response.success) {
            console.log('Connexion réussie', response);
            
            // Rediriger selon le rôle
            this.redirectBasedOnRole(response.user.role);
            
            alert('Connexion réussie !');
          } else {
            alert(`Erreur: ${response.message}`);
          }
          
          this.isLoading = false;
          this.user = { email: '', password: '', role: 2 };
        },
        (error) => {
          console.error('Erreur de connexion', error);
          this.isLoading = false;
          
          if (error.error && error.error.message) {
            alert(`Erreur: ${error.error.message}`);
          } else {
            alert('Erreur de connexion au serveur');
          }
        }
      );
    } else {
      alert('Veuillez remplir tous les champs');
    }
  }

  private redirectBasedOnRole(role: number): void {
    if(role == 0) {
      
    }
    switch(role) {
      case 0: // Admin
        this.router.navigate(['/admin/dashboard']);
        break;
      case 1: // Acheteur
        this.router.navigate(['/acheteur/dashboard']);
        break;
      case 2: // Boutique
        this.router.navigate(['/boutique/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  // Vérifier si déjà connecté
  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      // Rediriger selon le rôle si déjà connecté
      const role = this.authService.getRole();
      this.redirectBasedOnRole(role || 1); // Par défaut rediriger vers acheteur
    }
  }
}
