import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AutoresService } from '../../services/autores';
import { Autor } from '../../services/indexeddb';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  totalAutores = 0;
  ultimosAutores: Autor[] = [];

  constructor(
    private autoresService: AutoresService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    const autores = await this.autoresService.getAll();
    this.totalAutores = autores.length;
    this.ultimosAutores = autores.slice(-5).reverse();
    this.cdr.detectChanges();
  }
}