import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product } from '../../services/server.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ dodaj FormsModule ovde
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  cartItems: Product[] = [];
  total = 0;
  name = '';
  address = '';
  email = '';

  constructor(private cart: CartService, private router: Router) {
    this.cartItems = this.cart.getItems();
    this.total = this.cartItems.reduce((sum, p) => sum + p.price, 0);
  }

  submitOrder(): void {
    if (!this.name || !this.address || !this.email) {
      alert('Molimo unesite sve podatke.');
      return;
    }

    const orderData = {
      id: 'ORDER' + Date.now(),
      name: this.name,
      address: this.address,
      email: this.email,
      items: this.cartItems,
      total: this.total
    };

    localStorage.setItem('currentOrder', JSON.stringify(orderData));
    this.router.navigate(['/payment']);
  }
}
