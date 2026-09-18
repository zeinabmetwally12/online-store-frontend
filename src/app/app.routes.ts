import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.components';
import { LoginComponent } from './pages/login/login.components';
import { CartComponent } from './pages/cart/cart.component';
import { AddProductComponent } from './pages/add-product/add-product.components';
import { OrdersComponent } from './pages/orders/orders.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { ProfileComponent } from './pages/profile/profile.component';
export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: CartComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'edit-product/:id', component: EditProductComponent },
  { path: '**', redirectTo: 'products' }
];
