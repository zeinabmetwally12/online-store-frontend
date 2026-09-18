import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-card">
      <h2 style="text-align: center; margin-top: 0;">{{ isRegister ? 'Register' : 'Login' }}</h2>
      <p *ngIf="message" style="color: #ef4444; text-align: center;">{{ message }}</p>

      <form (ngSubmit)="onSubmit()">
        <div class="form-group" *ngIf="isRegister">
          <label>Full Name</label>
          <input type="text" [(ngModel)]="credentials.name" name="name" required />
        </div>
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" [(ngModel)]="credentials.email" name="email" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" [(ngModel)]="credentials.password" name="password" required />
        </div>
        <button type="submit" class="btn-primary">{{ isRegister ? 'Sign Up' : 'Log In' }}</button>
      </form>

      <button (click)="isRegister = !isRegister" class="btn-secondary">
        {{ isRegister ? 'Already have an account? Login' : "Don't have an account? Register" }}
      </button>
    </div>
  `
})
export class LoginComponent {
  isRegister = false;
  credentials = { name: '', email: '', password: '' };
  message = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    const action = this.isRegister
      ? this.auth.register(this.credentials)
      : this.auth.login(this.credentials);

    action.subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.message = err.error?.message || 'Authentication failed.';
      }
    });
  }
}