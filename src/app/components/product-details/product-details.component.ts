import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  route = inject(ActivatedRoute);
  cartService = inject(CartService);

  product: any;

  ngOnInit() {
    // Podaci dolaze iz state-a (ako korisnik klikne iz liste)
    const state = history.state;
    if (state && state.product) {
      this.product = state.product;
    } else {
      // Ako neko direktno otvori URL /product/:id
      const id = this.route.snapshot.paramMap.get('id');
      this.product = { id, name: 'Nepoznat proizvod', price: 0, description: 'Nema podataka.' };
    }
  }

  addToCart() {
    this.cartService.addToCart(this.product);
    alert(`${this.product.name} dodat u korpu ✅`);
  }
}
