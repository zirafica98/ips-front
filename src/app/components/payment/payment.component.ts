import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../services/payment.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  paymentStatus: 'idle' | 'loading' | 'success' | 'fail' = 'idle';
  message = '';
  order: any;

  constructor(
    private paymentService: PaymentService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.order = JSON.parse(localStorage.getItem('currentOrder') || '{}');

    if (this.order?.id) {
      this.startPayment();
    } else {
      this.message = '❌ Nema aktivne porudžbine.';
    }
  }

  startPayment(): void {
    this.paymentStatus = 'loading';
    this.message = '⏳ Pokrećem plaćanje...';

    this.paymentService.createPayment(this.order.id, this.order.total).subscribe({
      next: (res) => {
        // 🚀 Očekujemo plain string iz backend-a (direktni Payten link)
        const paymentUrl = typeof res === 'string' ? res : '';

        if (!paymentUrl) {
          this.paymentStatus = 'fail';
          this.message = '❌ Greška: link za plaćanje nije vraćen.';
          return;
        }

        try {
          const url = new URL(paymentUrl);
          const isHttps = url.protocol === 'https:';
          const isPayten = url.hostname.endsWith('pgw.payten.com');

          if (!isHttps || !isPayten) {
            this.paymentStatus = 'fail';
            this.message = '❌ Greška: neispravan link za plaćanje.';
            return;
          }

          // ✅ Redirekcija na Payten
          window.location.replace(paymentUrl);
        } catch (error) {
          console.error('Invalid URL format:', error);
          this.paymentStatus = 'fail';
          this.message = '❌ Greška: neispravan format URL-a.';
        }
      },
      error: (err) => {
        console.error(err);
        this.paymentStatus = 'fail';
        this.message = '❌ Greška pri pokretanju plaćanja.';
      }
    });
  }

  checkStatus(): void {
    this.paymentStatus = 'loading';
    this.message = '🔄 Proveravam status plaćanja...';

    this.paymentService.checkPaymentStatus(this.order.id, this.order.total).subscribe({
      next: async (res) => {
        if (res.responseCode === '00') {
          this.paymentStatus = 'success';
          this.message = '✅ Plaćanje uspešno!';
          await this.orderService.updateOrderStatus(this.order.id, 'paid').toPromise();
        } else {
          this.paymentStatus = 'fail';
          this.message = '❌ Plaćanje neuspešno.';
          await this.orderService.updateOrderStatus(this.order.id, 'failed').toPromise();
        }
      },
      error: async (err) => {
        console.error(err);
        this.paymentStatus = 'fail';
        this.message = '❌ Greška prilikom provere.';
        await this.orderService.updateOrderStatus(this.order.id, 'error').toPromise();
      }
    });
  }
}
