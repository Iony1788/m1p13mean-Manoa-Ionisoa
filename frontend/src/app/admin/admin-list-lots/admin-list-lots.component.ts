import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LotService } from '../services/listeLot-service';
import { Lot } from '../services/lotModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-list-lot',
  templateUrl: './admin-list-lots.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./admin-list-lots.component.css']
})
export class AdminListLotComponent implements OnInit {

  lots: Lot[] = [];           
  displayedLots: Lot[] = [];  

  // Pagination
  currentPage = 1;
  itemsPerPage = 4;
  totalPages = 0;

  constructor(
    private lotService: LotService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLots();
  }

  loadLots(): void {
    this.lotService.getAllLots().subscribe({
      next: (data) => {
        this.lots = data;
        this.totalPages = Math.ceil(this.lots.length / this.itemsPerPage);
        this.updateDisplayedLots();
        this.cd.detectChanges();
      },
      error: (err) => console.error('Erreur complète:', err)
    });
  }

  updateDisplayedLots(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedLots = this.lots.slice(start, end);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedLots();
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }
}