import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 2rem; max-width: 800px; margin: 0 auto;">
      <h2 style="color: #fff; margin-bottom: 1.5rem;">Your Shopping Cart</h2>

      <div *ngIf="!cartItems || cartItems.length === 0" style="background: #1e293b; padding: 2rem; border-radius: 8px; color: #94a3b8; text-align: center;">
        Your cart is empty.
      </div>

      <div *ngIf="cartItems && cartItems.length > 0">
        <div style="background: #1e293b; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; color: #fff; display: flex; justify-content: space-between; align-items: center;" *ngFor="let item of cartItems">
          <div style="flex: 1;">
            <h3 style="margin: 0; color: #f8fafc;">{{ getItemName(item) }}</h3>
            <div style="color: #38bdf8; font-weight: bold; margin-top: 0.25rem;">
              \${{ getItemPrice(item).toFixed(2) }} each
            </div>
          </div>

          <!-- Quantity Controls (+ / -) -->
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-right: 1.5rem;">
            <button 
              (click)="updateQty(item, -1)" 
              style="background: #334155; color: white; border: none; width: 32px; height: 32px; border-radius: 4px; font-weight: bold; cursor: pointer;">
              -
            </button>
            <span style="font-weight: bold; color: #fff; min-width: 24px; text-align: center;">{{ item.quantity || 1 }}</span>
            <button 
              (click)="updateQty(item, 1)" 
              style="background: #334155; color: white; border: none; width: 32px; height: 32px; border-radius: 4px; font-weight: bold; cursor: pointer;">
              +
            </button>
          </div>

          <!-- Price & Remove Action -->
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="font-weight: bold; font-size: 1.2rem; color: #4ade80;">
              \${{ getItemTotal(item) }}
            </div>
            <button 
              (click)="removeItem(item)" 
              style="background: #ef4444; color: white; border: none; padding: 0.4rem 0.75rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">
              Remove
            </button>
          </div>
        </div>

        <!-- Total Card -->
        <div style="margin-top: 1.5rem; background: #0f172a; border: 1px solid #334155; padding: 1.5rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #fff; font-size: 1.2rem; font-weight: bold;">Total:</span>
          <span style="color: #4ade80; font-size: 1.5rem; font-weight: bold;">\${{ getTotalPrice() }}</span>
        </div>

        <!-- Checkout Action Button -->
        <div style="margin-top: 1.5rem; text-align: right;">
          <button 
            (click)="checkout()" 
            [disabled]="loading"
            style="background: #22c55e; color: white; border: none; padding: 0.85rem 2rem; border-radius: 6px; font-weight: bold; font-size: 1.1rem; cursor: pointer; transition: background 0.2s;">
            {{ loading ? 'Processing...' : 'Checkout Now' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  loading: boolean = false;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.productService.getCart().subscribe({
      next: (res: any) => {
        const items = res.items || res.cart?.items || (Array.isArray(res) ? res : []);
        this.cartItems = [...items];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching cart:', err)
    });
  }

  getProductId(item: any): string {
    return item.productId?._id || item.productId || item.product?._id || item.product;
  }

  getItemName(item: any): string {
    return item.productId?.name || item.productId?.title || item.product?.name || 'Store Item';
  }

  getItemPrice(item: any): number {
    const price = item.productId?.price ?? item.product?.price ?? item.price ?? 0;
    return Number(price) || 0;
  }

  getItemTotal(item: any): string {
    return (this.getItemPrice(item) * (item.quantity || 1)).toFixed(2);
  }

  getTotalPrice(): string {
    return this.cartItems
      .reduce((total, item) => total + (this.getItemPrice(item) * (item.quantity || 1)), 0)
      .toFixed(2);
  }

  updateQty(item: any, change: number): void {
    const newQty = (item.quantity || 1) + change;
    const productId = this.getProductId(item);

    if (newQty <= 0) {
      this.removeItem(item);
      return;
    }

    this.productService.updateCartQuantity(productId, newQty).subscribe({
      next: (res: any) => {
        const items = res.items || res.cart?.items || [];
        this.cartItems = [...items];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to update quantity:', err)
    });
  }

  removeItem(item: any): void {
    const productId = this.getProductId(item);
    this.productService.removeFromCart(productId).subscribe({
      next: (res: any) => {
        const items = res.items || res.cart?.items || [];
        this.cartItems = [...items];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to remove item:', err)
    });
  }

  checkout(): void {
    if (this.cartItems.length === 0) return;

    this.loading = true;
    this.productService.checkout().subscribe({
      next: (res: any) => {
        this.loading = false;
        alert('🎉 Order placed successfully!');
        this.cartItems = [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Checkout failed.');
        console.error('Checkout error:', err);
      }
    });
  }
}