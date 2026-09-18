// app.ts / app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  constructor(private productService: ProductService) {}

  get currentUser() {
    return this.productService.getUser();
  }

  get isAdmin(): boolean {
    return this.productService.isAdmin();
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}