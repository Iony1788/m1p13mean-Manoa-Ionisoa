import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../acheteur/services/auth.service';

@Component({
  selector: 'app-login-admin',
  standalone: true, 
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginAdminComponent {

  email: string = 'admin@example.com';   
  password: string = '123456';   
  message: string = '';    

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
  this.authService.login(this.email, this.password).subscribe({
    next: (res) => {

      console.log(res);

      if (!res.role || res.role.toLowerCase() !== 'admin') {
        this.message = "Accès réservé aux administrateurs";
        return;
      }

      this.authService.saveToken(res.token);
      this.router.navigate(['/admin/dashboard']);
    },
    error: () => {
      this.message = "Email ou mot de passe incorrect";
    }
  });
}
}