import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 2rem; max-width: 600px; margin: 0 auto; color: #fff;">
      <h2 style="margin-bottom: 1.5rem;">Edit Product</h2>

      <div *ngIf="loading" style="color: #94a3b8;">Loading product details...</div>

      <form *ngIf="!loading" (ngSubmit)="onSubmit()" style="background: #1e293b; padding: 2rem; border-radius: 8px; display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <label style="display: block; margin-bottom: 0.5rem; color: #cbd5e1;">Product Name</label>
          <input type="text" [(ngModel)]="product.name" name="name" required style="width: 100%; padding: 0.75rem; border-radius: 6px; border: 1px solid #334155; background: #0f172a; color: #fff;" />
        </div>

        <div>
          <label style="display: block; margin-bottom: 0.5rem; color: #cbd5e1;">Price (\$)</label>
          <input type="number" [(ngModel)]="product.price" name="price" required style="width: 100%; padding: 0.75rem; border-radius: 6px; border: 1px solid #334155; background: #0f172a; color: #fff;" />
        </div>

        <div>
          <label style="display: block; margin-bottom: 0.5rem; color: #cbd5e1;">Description</label>
          <textarea [(ngModel)]="product.description" name="description" rows="4" style="width: 100%; padding: 0.75rem; border-radius: 6px; border: 1px solid #334155; background: #0f172a; color: #fff;"></textarea>
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
          <button type="submit" [disabled]="saving" style="flex: 1; background: #f59e0b; color: white; border: none; padding: 0.75rem; border-radius: 6px; font-weight: bold; cursor: pointer;">
            {{ saving ? 'Saving...' : 'Update Product' }}
          </button>
          <button type="button" (click)="cancel()" style="background: #475569; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer;">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `
})
export class EditProductComponent implements OnInit {
  productId: string = '';
  product: any = { name: '', price: 0, description: '' };
  loading: boolean = true;
  saving: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (this.productId) {
      this.loadProduct();
    }
  }

 loadProduct(): void {
  this.productService.getProductById(this.productId).subscribe({
    next: (res: any) => {
      // Handles both direct object returns and wrapped { product: ... } responses
      const data = res.product || res.data || res;
      this.product = {
        name: data.name || data.title || '',
        price: data.price || 0,
        description: data.description || ''
      };
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Failed to fetch product:', err);
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}

  onSubmit(): void {
    this.saving = true;
    this.productService.updateProduct(this.productId, this.product).subscribe({
      next: () => {
        this.saving = false;
        alert('Product updated successfully!');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.saving = false;
        alert(err.error?.message || 'Failed to update product');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}