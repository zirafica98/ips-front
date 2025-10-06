import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // ✅ ovde čitamo URL


export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  brand: string;
  image: string;
  stock: number;
  sku: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // 🔹 GET svi proizvodi
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  // 🔹 GET proizvod po ID-u
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  // 🔹 Dodavanje u korpu
  addToCart(item: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart`, item);
  }

  // 🔹 Checkout
  checkout(orderData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/checkout`, orderData);
  }
}
