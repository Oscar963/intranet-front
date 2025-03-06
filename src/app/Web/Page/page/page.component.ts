import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebService } from '../../../services/web.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Page } from '../../../interfaces/Page';

@Component({
  selector: 'app-page',
  imports: [ReactiveFormsModule],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css',
})
export class PageComponent {
  private webService = inject(WebService);
  private route = inject(ActivatedRoute);
  public page: Page[] = [];
  public slug!: string;
  public loading: boolean = false;
  public bannerId!: number; // ID del banner a actualizar

  form = new FormGroup({
    query: new FormControl(''),
    show: new FormControl(15),
  });

  ngOnInit() {
    // Obtener el ID del banner desde la URL
    this.slug = this.route.snapshot.paramMap.get('slug')?.toString() || '';
    this.loadPage();
  }

  loadPage(): void {
    console.log(this.slug);
  }
}
