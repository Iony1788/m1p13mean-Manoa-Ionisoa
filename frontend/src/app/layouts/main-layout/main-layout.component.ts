import { Component, OnInit } from '@angular/core';
import { App } from '../../app';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: ` 
  <app-header></app-header>
  <router-outlet></router-outlet>
  <app-footer></app-footer> 
  `
})
export class MainLayoutComponent { }
