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
      this.message = 'Nema aktivne porudžbine.';
    }
  }

  startPayment(): void {
    this.paymentStatus = 'loading';
    this.message = '⏳ Prvo generišem token...';

    this.paymentService.generateToken().subscribe({
      next: (token) => {
        if (!token) {
          this.paymentStatus = 'fail';
          this.message = 'Token nije generisan.';
          return;
        }
        this.message = 'Token generisan, pokrećem plaćanje...';

        this.paymentService.createPayment(this.order.id, this.order.total).subscribe({
          next: (res) => {
            // 🚀 Očekujemo plain string iz backend-a (direktni Payten link)
            let paymentUrl = typeof res === 'string' ? res : '';

            // Trim and strip surrounding quotes if present
            paymentUrl = (paymentUrl || '').trim();
            if ((paymentUrl.startsWith('"') && paymentUrl.endsWith('"')) || (paymentUrl.startsWith("'") && paymentUrl.endsWith("'"))) {
              paymentUrl = paymentUrl.slice(1, -1).trim();
            }

            // If the backend accidentally returned a JSON string like '{ "qrCodeURL": "https://..." }', try to parse it
            try {
              const maybe = JSON.parse(paymentUrl);
              if (maybe && typeof maybe === 'object') {
                paymentUrl = maybe.qrCodeURL || maybe.qrCodeUrl || maybe.qrUrl || maybe.url || maybe.paymentUrl || paymentUrl;
              }
            } catch (_) {
              // not JSON — ignore
            }

            if (!paymentUrl) {
              this.paymentStatus = 'fail';
              this.message = 'Greška: link za plaćanje nije vraćen.';
              return;
            }

            try {
              // If protocol is missing, assume https
              let candidate = paymentUrl;
              if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(candidate)) {
                candidate = 'https://' + candidate;
              }

              const url = new URL(candidate);
              const isHttps = url.protocol === 'https:';
              const isPayten = url.hostname.endsWith('pgw.payten.com');

              if (!isHttps || !isPayten) {
                this.paymentStatus = 'fail';
                this.message = 'Greška: neispravan link za plaćanje.';
                return;
              }

              // ✅ Redirekcija na Payten
              window.location.replace(url.toString());
            } catch (error) {
              console.error('Invalid URL format:', error);
              this.paymentStatus = 'fail';
              this.message = 'Greška: neispravan format URL-a.';
            }
          },
          error: (err) => {
            console.error(err);
            this.paymentStatus = 'fail';
            this.message = 'Greška pri pokretanju plaćanja.';
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.paymentStatus = 'fail';
        this.message = 'Greška pri generisanju tokena.';
      }
    });
  }

  checkStatus(): void {
    this.paymentStatus = 'loading';
    this.message = 'Proveravam status plaćanja...';

    this.paymentService.checkPaymentStatus(this.order.id, this.order.total).subscribe({
      next: async (res) => {
        if (res.responseCode === '00') {
          this.paymentStatus = 'success';
          this.message = '✅ Plaćanje uspešno!';
          await this.orderService.updateOrderStatus(this.order.id, 'paid').toPromise();
        } else {
          this.paymentStatus = 'fail';
          this.message = 'Plaćanje neuspešno.';
          await this.orderService.updateOrderStatus(this.order.id, 'failed').toPromise();
        }
      },
      error: async (err) => {
        console.error(err);
        this.paymentStatus = 'fail';
        this.message = 'Greška prilikom provere.';
        await this.orderService.updateOrderStatus(this.order.id, 'error').toPromise();
      }
    });
  }
}
