import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importez FormsModule
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acheteur-register',
  imports: [CommonModule, FormsModule], // Utilisez FormsModule au lieu de ReactiveFormsModule
  templateUrl: './acheteur-register.html',
  styleUrls: ['./acheteur-register.css']
})
export class AcheteurRegister {
  registerData = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  selectedFile: File | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Format de fichier non supporté. Utilisez JPG, PNG ou GIF.';
        event.target.value = '';
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Fichier trop volumineux. Maximum 5MB.';
        event.target.value = '';
        return;
      }
      
      this.selectedFile = file;
      this.errorMessage = '';
    }
  }

  onSubmit(): void {
    // Validation
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    // Validation des champs requis
    if (!this.registerData.nom || !this.registerData.prenom || !this.registerData.email || !this.registerData.password) {
      this.errorMessage = 'Tous les champs sont requis';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.registerAcheteur(
      this.registerData.nom,
      this.registerData.prenom,
      this.registerData.email,
      this.registerData.password,
      this.selectedFile!
    ).subscribe({
      next: (response) => {
        console.log('Inscription réussie:', response);
        alert('Inscription réussie!');
      },
      error: (error) => {
        console.error('Erreur d\'inscription:', error);
        this.errorMessage = error.error?.message || 'Erreur lors de l\'inscription';
        this.isLoading = false;
      }
    });
  }
}