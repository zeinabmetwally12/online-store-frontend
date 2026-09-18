import { Component, input, output } from '@angular/core';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {

  product = input.required<Product>();

  addToCartEvent = output<Product>();

  addToCart() {
    this.addToCartEvent.emit(this.product());
  }

}