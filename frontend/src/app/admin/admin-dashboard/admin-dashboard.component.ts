import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LotService } from '../services/listeLot-service';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  standalone: true
})
export class AdminDashboardComponent implements OnInit {

  total = 0;
  libres = 0;
  reserves = 0;
  occupes = 0;
  totalClients = 0;

  constructor(
    private lotService: LotService,
    private cd: ChangeDetectorRef // 🔹 important
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadClientStats();
  }

  loadStats() {
    this.lotService.getStats().subscribe({
      next: (data) => {
        console.log("Stats:", data);
        this.total = data.total;
        this.libres = data.libres;
        this.reserves = data.reserves;
        this.occupes = data.occupes;

        this.cd.detectChanges(); 
      },
      error: (err) => {
        console.error("Erreur stats:", err);
      }
    });
  }

  loadClientStats() {
  this.lotService.getClientStats().subscribe({
    next: (data) => {
      console.log("Stats Clients:", data);
      this.totalClients = data.total;
      this.cd.detectChanges(); // 🔹 force update
    },
    error: (err) => {
      console.error("Erreur clients:", err);
    }
  });
}
}