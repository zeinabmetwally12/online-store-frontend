import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api/v1';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  // Get all store products
  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`, { headers: this.getHeaders() });
  }

  // Add new product (Admin route)
  createProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, product, { headers: this.getHeaders() });
  }

  // Get logged-in user's shopping cart -> Fix URL to /cart
  getCart(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart`, { headers: this.getHeaders() });
  }

  // Add item to cart -> Fix URL to /cart/add
  addToCart(productId: string, quantity: number = 1): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/add`, { productId, quantity }, { headers: this.getHeaders() });
  }

  // Update item quantity
updateCartQuantity(productId: string, quantity: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/cart/update`, { productId, quantity }, { headers: this.getHeaders() });
}

// Remove item from cart
removeFromCart(productId: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/cart/item/${productId}`, { headers: this.getHeaders() });
}

checkout(): Observable<any> {
  return this.http.post(`${this.apiUrl}/orders/checkout`, {}, { headers: this.getHeaders() });
}

getUserOrders(): Observable<any> {
  return this.http.get(`${this.apiUrl}/orders`, { headers: this.getHeaders() });
}

deleteProduct(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/products/${id}`, { headers: this.getHeaders() });
}

addProduct(productData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/products`, productData, { headers: this.getHeaders() });
}


getUserRole(): string {
  const token = localStorage.getItem('token');
  if (!token) return 'user';
  
  try {
    // Decodes the payload from your stored JWT token
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || 'user';
  } catch (e) {
    return 'user';
  }
}

isAdmin(): boolean {
  return this.getUserRole() === 'admin';
}


getProductById(id: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/products/${id}`);
}

updateProduct(id: string, productData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/products/${id}`, productData, { headers: this.getHeaders() });
}

getUser(): { name?: string; username?: string; email?: string; role?: string } | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      name: payload.name || payload.username || payload.email?.split('@')[0] || 'User',
      email: payload.email,
      role: payload.role || 'user'
    };
  } catch (e) {
    return null;
  }
}

}

