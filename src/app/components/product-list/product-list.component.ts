import { Component, OnInit } from '@angular/core';
import { ServerService, Product } from '../../services/server.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [CommonModule]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;

  constructor(private server: ServerService, private cart: CartService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.server.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Greška pri učitavanju proizvoda:', err);
        this.loading = false;
      }
    });
  }

  addToCart(product: Product): void {
    this.cart.addToCart(product);
  }
}
