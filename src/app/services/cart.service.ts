import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './server.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: Product[] = [];

  // reactive cart count
  private count$ = new BehaviorSubject<number>(0);

  // expose as observable for components to subscribe
  getCartCount(): Observable<number> {
    return this.count$.asObservable();
  }

  private emitCount() {
    this.count$.next(this.items.length);
  }

  addToCart(product: Product) {
    this.items.push(product);
    this.emitCount();
  }

  getItems() {
    return this.items;
  }


  removeItem(index: number) {
    if (index > -1 && index < this.items.length) {
      this.items.splice(index, 1);
      this.emitCount();
    }
  }

  clearCart() {
    this.items = [];
    this.emitCount();
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
}
