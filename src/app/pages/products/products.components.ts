import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 1. Import FormsModule
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule], // 2. Add FormsModule here
  template: `
    <div style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
      <h2 style="color: #fff; margin-bottom: 1.5rem;">Store Products</h2>

      <!-- Search & Filter Bar -->
      <div style="margin-bottom: 2rem;">
        <input 
          type="text" 
          [(ngModel)]="searchQuery" 
          placeholder="Search products by name or description..." 
          style="width: 100%; max-width: 500px; padding: 0.75rem 1rem; border-radius: 6px; border: 1px solid #334155; background: #1e293b; color: #fff; font-size: 1rem; outline: none;"
        />
      </div>

      <!-- No Products Match Search -->
      <div *ngIf="filteredProducts.length === 0" style="color: #94a3b8; text-align: center; padding: 2rem; background: #1e293b; border-radius: 8px;">
        No products match your search query "{{ searchQuery }}".
      </div>

      <!-- Product Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem;" *ngIf="filteredProducts.length > 0">
        <div *ngFor="let product of filteredProducts" style="background: #1e293b; border-radius: 8px; padding: 1.5rem; color: #fff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); display: flex; flex-direction: column; justify-content: space-between;">
          
          <!-- Product Info -->
          <div>
            <h3 style="margin-top: 0; color: #f8fafc; font-size: 1.25rem;">{{ product.name || product.title || 'Untitled Product' }}</h3>
            <p style="color: #94a3b8; font-size: 0.9rem; min-height: 2.5rem; margin-bottom: 1rem;">{{ product.description || 'No description available' }}</p>
          </div>

          <!-- Price & Buttons -->
          <div style="margin-top: 1rem; border-top: 1px solid #334155; padding-top: 1rem;">
            <div style="font-weight: bold; font-size: 1.3rem; color: #38bdf8; margin-bottom: 1rem;">
              \${{ product.price || 0 }}
            </div>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button (click)="addToCart(product._id)" style="flex: 1; background: #6366f1; color: white; border: none; padding: 0.6rem 0.5rem; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.85rem; white-space: nowrap;">
                Add to Cart
              </button>

              <button *ngIf="isAdmin" (click)="editProduct(product._id)" style="background: #f59e0b; color: white; border: none; padding: 0.6rem 0.75rem; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.85rem;">
                Edit
              </button>

              <button *ngIf="isAdmin" (click)="deleteProduct(product._id)" style="background: #ef4444; color: white; border: none; padding: 0.6rem 0.75rem; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.85rem;">
                Delete
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  searchQuery: string = ''; // 3. Search query variable

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        const rawData = Array.isArray(res) ? res : (res.products || res.data || []);
        this.products = [...rawData];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  // 4. Getter method to compute filtered products dynamically
  get filteredProducts(): any[] {
    if (!this.searchQuery.trim()) {
      return this.products;
    }
    const query = this.searchQuery.toLowerCase().trim();
    return this.products.filter(p => {
      const name = (p.name || p.title || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      return name.includes(query) || desc.includes(query);
    });
  }

  addToCart(productId: string): void {
    this.productService.addToCart(productId, 1).subscribe({
      next: () => alert('Product added to cart!'),
      error: (err) => console.error('Failed to add to cart:', err)
    });
  }

  editProduct(id: string): void {
    this.router.navigate(['/edit-product', id]);
  }

  deleteProduct(id: string): void {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p._id !== id);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to delete product:', err)
    });
  }

  get isAdmin(): boolean {
    return this.productService.isAdmin();
  }
}