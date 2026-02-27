import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Boutique } from '../services/boutique.model';
import { BoutiqueService } from '../services/boutique-service';

@Component({
  selector: 'app-boutique-info',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './boutique-info.component.html',
  styleUrls: ['./boutique-info.component.css']
})
export class BoutiqueInfoComponent implements OnInit {

  boutiqueForm!: FormGroup;
  boutique!: Boutique;
  loading: boolean = false;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private boutiqueService: BoutiqueService
  ) {}

  ngOnInit(): void {
    // 1️⃣ Initialise le formulaire vide dès le début
    this.initForm();

    // 2️⃣ Charge la boutique
    this.loadBoutique();
  }

  initForm() {
    this.boutiqueForm = this.fb.group({
      nom: ['', Validators.required],
      adresse: [''],
      description: [''],
      telephone: ['']
    });
  }

  loadBoutique() {
    this.loading = true;
    this.boutiqueService.getBoutiqueConnectee().subscribe({
      next: (data) => {
        this.boutique = data;

        // 3️⃣ Remplit les champs existants avec patchValue
        this.boutiqueForm.patchValue({
          nom: data.nom,
          adresse: data.adresse,
          description: data.description,
          telephone: data.telephone
        });

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = "Impossible de charger les infos de la boutique";
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.boutiqueForm.invalid) {
      return;
    }

    this.boutiqueService.updateBoutique(this.boutiqueForm.value).subscribe({
      next: (res) => {
        this.boutique = res;

        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Boutique mise à jour avec succès !',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la mise à jour',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}