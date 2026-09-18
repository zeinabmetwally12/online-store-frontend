import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 2rem; max-width: 800px; margin: 0 auto;">
      <h2 style="color: #fff; margin-bottom: 1.5rem;">Your Order History</h2>

      <div *ngIf="loading" style="color: #94a3b8; text-align: center;">Loading orders...</div>

      <div *ngIf="!loading && (!orders || orders.length === 0)" style="background: #1e293b; padding: 2rem; border-radius: 8px; color: #94a3b8; text-align: center;">
        You haven't placed any orders yet.
      </div>

      <div *ngIf="!loading && orders && orders.length > 0">
        <div *ngFor="let order of orders" style="background: #1e293b; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid #334155;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #334155; padding-bottom: 0.75rem; margin-bottom: 1rem;">
            <div>
              <span style="color: #94a3b8; font-size: 0.85rem;">Order ID:</span>
              <div style="color: #fff; font-weight: bold; font-family: monospace;">#{{ order._id }}</div>
            </div>
            <div style="text-align: right;">
              <span style="color: #94a3b8; font-size: 0.85rem;">Date:</span>
              <div style="color: #cbd5e1;">{{ formatDate(order.createdAt) }}</div>
            </div>
          </div>

          <!-- Order Items -->
          <div *ngFor="let item of order.items" style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #cbd5e1;">
            <span>{{ getItemName(item) }} (x{{ item.quantity }})</span>
            <span style="color: #f8fafc;">\${{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>

          <!-- Total Footer -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; pt-3; border-top: 1px dashed #334155; padding-top: 0.75rem;">
            <span style="background: #065f46; color: #34d399; padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.85rem; font-weight: bold;">
              {{ order.status || 'Completed' }}
            </span>
            <div style="font-size: 1.2rem; font-weight: bold; color: #4ade80;">
              Total: \${{ order.totalAmount?.toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  loading: boolean = true;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.productService.getUserOrders().subscribe({
      next: (res: any) => {
        this.orders = Array.isArray(res) ? res : res.orders || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch orders:', err);
        this.loading = false;
      }
    });
  }

  getItemName(item: any): string {
    return item.productId?.name || item.productId?.title || item.name || 'Store Item';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}