import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  styleUrls: ['./register.component.css'],
  templateUrl: './register.component.html',
  standalone: true,
  imports: [FormsModule]
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
    this.authService.register(this.nom, this.prenom, this.email, this.password, this.role)
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.message = err.error.message || 'Registration failed';
        }
      });
  }
}
