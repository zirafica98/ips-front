import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-payment-confirm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-confirm.component.html',
  styleUrls: ['./payment-confirm.component.scss']
})
export class PaymentConfirmComponent implements OnInit {
  accepted = false;
  // order review data
  name = '';
  address = '';
  email = '';
  items: Array<{ name: string; price: number }> = [];
  total = 0;
  orderId?: string;

  constructor(private router: Router, private cart: CartService) {}

  ngOnInit(): void {
    // Try to load current order from localStorage set during checkout
    try {
      const raw = localStorage.getItem('currentOrder');
      if (raw) {
        const parsed = JSON.parse(raw);
        this.name = parsed?.name ?? '';
        this.address = parsed?.address ?? '';
        this.email = parsed?.email ?? '';
        this.items = Array.isArray(parsed?.items) ? parsed.items : [];
        this.total = typeof parsed?.total === 'number' ? parsed.total : 0;
        this.orderId = parsed?.id;
      }
    } catch (e) {
      // ignore parse errors and fallback
    }

    // Fallback to current cart if no items from localStorage
    if (!this.items || this.items.length === 0) {
      this.items = this.cart.getItems();
      this.total = this.cart.getTotal();
    }
  }

  cancel() {
    this.router.navigate(['/cart']);
  }

  proceed() {
    if (!this.accepted) return;
    this.router.navigate(['/payment']);
  }

  edit() {
    this.router.navigate(['/checkout']);
  }
}
