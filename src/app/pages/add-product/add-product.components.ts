import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #fff; margin-bottom: 1.5rem;">Add New Product</h2>

      <div *ngIf="errorMessage" style="background: #ef4444; color: #fff; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1rem;">
        {{ errorMessage }}
      </div>

      <div *ngIf="successMessage" style="background: #22c55e; color: #fff; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1rem;">
        {{ successMessage }}
      </div>

      <form (ngSubmit)="onSubmit()" style="background: #1e293b; padding: 2rem; border-radius: 8px; display: flex; flex-direction: column; gap: 1.25rem;">
        <div>
          <label style="display: block; color: #cbd5e1; margin-bottom: 0.5rem; font-weight: 500;">Product Title / Name</label>
          <input 
            type="text" 
            [(ngModel)]="name" 
            name="name" 
            required
            placeholder="e.g. Wireless Headphones"
            style="width: 100%; padding: 0.75rem; border-radius: 6px; border: 1px solid #334155; background: #0f172a; color: #fff; box-sizing: border-box;"
          />
        </div>

        <div>
          <label style="display: block; color: #cbd5e1; margin-bottom: 0.5rem; font-weight: 500;">Price ($)</label>
          <input 
            type="number" 
            step="0.01"
            [(ngModel)]="price" 
            name="price" 
            required
            placeholder="e.g. 99.99"
            style="width: 100%; padding: 0.75rem; border-radius: 6px; border: 1px solid #334155; background: #0f172a; color: #fff; box-sizing: border-box;"
          />
        </div>

        <div>
          <label style="display: block; color: #cbd5e1; margin-bottom: 0.5rem; font-weight: 500;">Description</label>
          <textarea 
            [(ngModel)]="description" 
            name="description" 
            rows="3"
            placeholder="Enter product description..."
            style="width: 100%; padding: 0.75rem; border-radius: 6px; border: 1px solid #334155; background: #0f172a; color: #fff; box-sizing: border-box; resize: vertical;"
          ></textarea>
        </div>

        <button 
          type="submit" 
          [disabled]="loading"
          style="margin-top: 0.5rem; padding: 0.75rem; background: #3b82f6; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: background 0.2s;"
        >
          {{ loading ? 'Saving...' : 'Add Product' }}
        </button>
      </form>
    </div>
  `
})
export class AddProductComponent {
  name: string = '';
  price: number | null = null;
  description: string = '';
  
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit(): void {
    if (!this.name || this.price === null || this.price < 0) {
      this.errorMessage = 'Please enter a valid name and price.';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    const newProduct = {
      name: this.name,
      title: this.name,
      price: Number(this.price),
      description: this.description
    };

    const addMethod = this.productService.createProduct 
      ? this.productService.createProduct(newProduct) 
      : this.productService.addProduct(newProduct);

    addMethod.subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Product added successfully!';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/products']), 1200);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to create product.';
        console.error('Error adding product:', err);
        this.cdr.detectChanges();
      }
    });
  }
}