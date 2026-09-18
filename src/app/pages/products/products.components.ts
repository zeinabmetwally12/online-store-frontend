import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 2rem; max-width: 1200px; margin: 0 auto; color: #fff;">
      
      <!-- Search Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; gap: 1rem; flex-wrap: wrap;">
        <h1 style="font-size: 1.875rem; font-weight: bold; margin: 0;">Products</h1>
        
        <input 
          type="text" 
          [(ngModel)]="searchQuery" 
          (input)="filterProducts()" 
          placeholder="Search products..." 
          style="padding: 0.6rem 1rem; border-radius: 8px; border: 1px solid #334155; background: #1e293b; color: #fff; width: 100%; max-width: 320px; outline: none;"
        />
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" style="text-align: center; padding: 3rem; color: #94a3b8;">
        Loading products...
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && groupedKeys.length === 0" style="text-align: center; padding: 3rem; color: #94a3b8;">
        No products found.
      </div>

      <!-- Product Sections grouped by Description -->
      <div *ngFor="let groupKey of groupedKeys" style="margin-bottom: 2.5rem;">
        
        <!-- Section Header -->
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; border-bottom: 1px solid #334155; padding-bottom: 0.5rem;">
          <h2 style="font-size: 1.35rem; font-weight: 600; color: #38bdf8; margin: 0;">
            {{ groupKey }}
          </h2>
          <span style="background: #1e293b; color: #94a3b8; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 12px; border: 1px solid #334155;">
            {{ groupedProducts[groupKey].length }} items
          </span>
        </div>

        <!-- Product Cards Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
          <div 
            *ngFor="let product of groupedProducts[groupKey]" 
            style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; overflow: hidden; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between;"
          >
            <div>
              <!-- Product Image -->
              <div style="width: 100%; height: 180px; border-radius: 8px; overflow: hidden; background: #0f172a; margin-bottom: 1rem;">
                <img 
                  [src]="product.image || product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'" 
                  [alt]="product.name || product.title" 
                  style="width: 100%; height: 100%; object-fit: cover;"
                />
              </div>

              <!-- Product Title -->
              <h3 style="font-size: 1.1rem; font-weight: 600; margin: 0 0 0.5rem 0; color: #f8fafc;">
                {{ product.name || product.title }}
              </h3>
            </div>

            <!-- Price & Action Buttons Footer -->
            <div style="border-top: 1px solid #334155; padding-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem;">
              
              <!-- Price Row -->
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; font-size: 1.25rem; color: #38bdf8;">
                  \${{ product.price }}
                </span>
              </div>

              <!-- Action Buttons Row -->
              <div style="display: flex; gap: 0.4rem; justify-content: flex-start; width: 100%;">
                <button 
                  (click)="addToCart(product._id)" 
                  style="flex: 1; background: #3b82f6; color: white; border: none; padding: 0.5rem 0.4rem; border-radius: 6px; cursor: pointer; font-size: 0.75rem; font-weight: 600; text-align: center; white-space: nowrap;"
                >
                  Add to Cart
                </button>

                <button 
                  *ngIf="isAdmin" 
                  (click)="editProduct(product._id)" 
                  style="background: #f59e0b; color: white; border: none; padding: 0.5rem 0.6rem; border-radius: 6px; cursor: pointer; font-size: 0.75rem; font-weight: 600;"
                >
                  Edit
                </button>

                <button 
                  *ngIf="isAdmin" 
                  (click)="deleteProduct(product._id)" 
                  style="background: #ef4444; color: white; border: none; padding: 0.5rem 0.6rem; border-radius: 6px; cursor: pointer; font-size: 0.75rem; font-weight: 600;"
                >
                  Delete
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  groupedProducts: { [key: string]: any[] } = {};
  groupedKeys: string[] = [];
  searchQuery: string = '';
  loading: boolean = true;
  isAdmin: boolean = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.productService.isAdmin ? this.productService.isAdmin() : false;
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.products = Array.isArray(res) ? res : (res.products || []);
        this.groupProducts(this.products);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading products:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  groupProducts(items: any[]): void {
    const groups: { [key: string]: any[] } = {};

    items.forEach(product => {
      const descKey = product.description && product.description.trim() !== ''
        ? product.description.trim()
        : 'Uncategorized / No Description';

      if (!groups[descKey]) {
        groups[descKey] = [];
      }
      groups[descKey].push(product);
    });

    this.groupedProducts = groups;
    this.groupedKeys = Object.keys(groups);
  }

  filterProducts(): void {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) {
      this.groupProducts(this.products);
    } else {
      const filtered = this.products.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) || 
        (p.title && p.title.toLowerCase().includes(q)) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
      this.groupProducts(filtered);
    }
  }

  addToCart(productId: string): void {
    if (this.productService.addToCart) {
      this.productService.addToCart(productId).subscribe({
        next: () => alert('Product added to cart!'),
        error: (err: any) => console.error('Error adding to cart:', err)
      });
    } else {
      alert('Product added to cart!');
    }
  }

  editProduct(productId: string): void {
    this.router.navigate(['/edit-product', productId]);
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.products = this.products.filter(p => p._id !== productId);
          this.filterProducts();
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error deleting product:', err)
      });
    }
  }
}