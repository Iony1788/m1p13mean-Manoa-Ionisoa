import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../acheteur/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-side-bar',
  templateUrl: './admin-side-bar.component.html',
  styleUrls: ['./admin-side-bar.component.css'],
  imports: [RouterLink,RouterLinkActive,CommonModule]
})
export class AdminSideBarComponent implements OnInit {

  role: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.role = this.authService.getUserRole();
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login'; 
  }
}


