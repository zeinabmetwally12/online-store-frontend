import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div style="padding: 2rem; max-width: 600px; margin: 0 auto; color: #fff;">
      <h2 style="margin-bottom: 1.5rem;">User Profile</h2>

      <div *ngIf="user" style="background: #1e293b; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid #334155; padding-bottom: 1rem;">
          <div style="width: 50px; height: 50px; border-radius: 50%; background: #6366f1; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold;">
            {{ (user.name || 'U')[0].toUpperCase() }}
          </div>
          <div>
            <h3 style="margin: 0; color: #f8fafc;">{{ user.name || 'User' }}</h3>
            <span style="font-size: 0.85rem; color: #38bdf8; background: #0f172a; padding: 0.2rem 0.6rem; border-radius: 4px; text-transform: capitalize;">
              {{ user.role || 'user' }}
            </span>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label style="color: #94a3b8; font-size: 0.85rem; display: block;">Email Address</label>
            <span style="font-size: 1.1rem; color: #cbd5e1;">{{ user.email || 'N/A' }}</span>
          </div>

          <div>
            <label style="color: #94a3b8; font-size: 0.85rem; display: block;">Account Type</label>
            <span style="font-size: 1.1rem; color: #cbd5e1; text-transform: capitalize;">{{ user.role || 'user' }}</span>
          </div>
        </div>

        <div style="margin-top: 2rem; display: flex; gap: 1rem;">
          <a routerLink="/orders" style="flex: 1; text-align: center; background: #3b82f6; color: white; padding: 0.75rem; border-radius: 6px; text-decoration: none; font-weight: bold;">
            View Order History
          </a>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user: any = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.user = this.productService.getUser();
  }
}