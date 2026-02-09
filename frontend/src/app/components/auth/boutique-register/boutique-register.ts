import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-boutique-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './boutique-register.html',
  styleUrl: './boutique-register.css',
})
export class BoutiqueRegister {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      // Informations personnelles
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      
      // Informations boutique
      boutiqueName: ['', Validators.required],
      address: [''],
      phone: ['']
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { nom, prenom, email, password, boutiqueName, address, phone } = this.registerForm.value;
      
      this.authService.registerBoutique(
        nom, 
        prenom, 
        email, 
        password, 
        boutiqueName, 
        address, 
        phone
      ).subscribe({
        next: (response) => {
          console.log('Inscription boutique réussie:', response);
          alert('Inscription boutique réussie! Votre compte sera activé après validation par un administrateur.');
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
