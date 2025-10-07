import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  cartItems: any[] = [];
  total = 0;
  name = '';
  address = '';
  email = '';
  loading = false;

  constructor(
    private cart: CartService,
    private router: Router,
    private orderService: OrderService
  ) {
    this.cartItems = this.cart.getItems();
    this.total = this.cartItems.reduce((sum, p) => sum + p.price, 0);
  }

  submitOrder(): void {
    if (!this.name || !this.address || !this.email) {
      alert('Molimo unesite sve podatke.');
      return;
    }

    const orderData = {
      name: this.name,
      address: this.address,
      email: this.email,
      items: this.cartItems,
      total: this.total,
      status: 'pending'
    };

    this.loading = true;

    // 🔹 Poziv backend-a (Express → Firebase)
    this.orderService.createOrder(orderData).subscribe({
      next: (res) => {
        console.log('✅ Order created:', res.id);
        localStorage.setItem(
          'currentOrder',
          JSON.stringify({ ...orderData, id: res.id })
        );
        this.loading = false;
        this.router.navigate(['/payment']);
      },
      error: (err) => {
        console.error('❌ Error creating order:', err);
        alert('Greška pri kreiranju porudžbine.');
        this.loading = false;
      }
    });
  }
}
