import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatCardModule, MatIconModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  items: any[] = [];
  total = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.refreshCart();
  }

  refreshCart() {
    this.items = this.cartService.getItems();
    this.total = this.items.reduce((sum, item) => sum + item.price, 0);
  }

  clearCart() {
    this.cartService.clearCart();
    this.refreshCart();
  }

  removeItem(index: number) {
    this.cartService.removeItem(index);
    this.refreshCart();
  }
}
