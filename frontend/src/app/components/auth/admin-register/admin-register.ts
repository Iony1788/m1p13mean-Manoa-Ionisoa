import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-register.html',
  styleUrl: './admin-register.css',
})
export class AdminRegister {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { nom, prenom, email, password } = this.registerForm.value;
      
      this.authService.registerAdmin(nom, prenom, email, password).subscribe({
        next: (response) => {
          console.log('Inscription admin réussie:', response);
          alert('Inscription administrateur réussie!');
          this.registerForm.reset();
        },
        error: (error) => {
          console.error('Erreur d\'inscription:', error);
          alert(`Erreur: ${error.error?.message || 'Inscription échouée'}`);
        }
      });
    }
  }
}