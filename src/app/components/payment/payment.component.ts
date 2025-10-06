import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../services/payment.service';

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

  constructor(private paymentService: PaymentService) {}

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

    setTimeout(() => {
      this.paymentService.checkPaymentStatus(this.order.id, this.order.total).subscribe({
        next: (res) => {
          if (res.responseCode === '00') {
            this.paymentStatus = 'success';
            this.message = '✅ Plaćanje uspešno!';
          } else {
            this.paymentStatus = 'fail';
            this.message = '❌ Plaćanje neuspešno.';
          }
        },
        error: () => {
          this.paymentStatus = 'fail';
          this.message = '❌ Greška prilikom provere.';
        }
      });
    }, 1500); // mala animacija čekanja
  }
}
