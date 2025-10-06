import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  products = [
    { id: 1, name: 'Laptop', price: 800, description: 'Snažan laptop za posao i zabavu.' },
    { id: 2, name: 'Telefon', price: 500, description: 'Moderan pametni telefon.' },
    { id: 3, name: 'Monitor', price: 300, description: 'Full HD monitor od 27 inča.' }
  ];

  constructor(private cartService: CartService, private router: Router) {}

  addToCart(product: any) {
    this.cartService.addToCart(product);
    alert(`${product.name} dodat u korpu ✅`);
  }

  viewDetails(product: any) {
    this.router.navigate(['/product', product.id], { state: { product } });
  }
}
