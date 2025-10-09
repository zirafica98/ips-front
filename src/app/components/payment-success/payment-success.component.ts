import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../../services/order.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent {
  message = '✅ Plaćanje uspešno!';
  order: any;

  constructor(
    private orderService: OrderService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.order = JSON.parse(localStorage.getItem('currentOrder') || '{}');

    if (this.order?.id) {
      // 1️⃣ ažuriraj status porudžbine u bazi (ako koristiš Firebase / API)
      this.orderService.updateOrderStatus(this.order.id, 'paid').subscribe({
        next: () => console.log('📦 Order status updated to PAID')
      });

      // 2️⃣ pozovi backend /api/payment/confirm da pošalje email korisniku
      if (this.order?.email) {
        this.http.post(`${environment.apiUrl}/payment/confirm`, {
          orderId: this.order.id,
          amount: this.order.total,
          email: this.order.email
        }).subscribe({
          next: () => console.log('📧 Mail potvrde poslat korisniku'),
          error: (err) => console.error('❌ Greška pri slanju maila:', err)
        });
      } else {
        console.warn('⚠️ Nema email adrese u localStorage (order.email).');
      }
    } else {
      console.warn('⚠️ Nema aktivne porudžbine u localStorage.');
    }

    // 3️⃣ Po želji očisti localStorage da ne ostane stara porudžbina
    localStorage.removeItem('currentOrder');
  }
}
