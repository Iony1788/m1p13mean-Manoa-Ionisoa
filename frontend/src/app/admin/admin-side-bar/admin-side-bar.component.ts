import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-side-bar',
  templateUrl: './admin-side-bar.component.html',
  styleUrls: ['./admin-side-bar.component.css'],
  imports: [RouterLink,RouterLinkActive]
})
export class AdminSideBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
