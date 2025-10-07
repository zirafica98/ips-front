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
  qrCodeUrl: string | null = null;
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
    this.message = '⏳ Generišem IPS QR kod...';
    this.paymentService.createPayment(this.order.id, this.order.total).subscribe({
      next: (res) => {
        this.qrCodeUrl = res.qrCodeURL;
        this.paymentStatus = 'idle';
        this.message = '✅ QR kod je spreman. Skenirajte ga u svojoj mBanking aplikaciji.';
      },
      error: (err) => {
        console.error(err);
        this.paymentStatus = 'fail';
        this.message = '❌ Greška pri generisanju QR koda.';
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
