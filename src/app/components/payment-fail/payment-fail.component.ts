import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-payment-fail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-fail.component.html',
  styleUrls: ['./payment-fail.component.scss']
})
export class PaymentFailComponent {
  order: any;
  now = new Date();
  preview = false;

  // izvedena polja
  get orderId(): string { return this.order?.id || '—'; }
  get amount(): string {
    const val = this.order?.total ?? this.order?.amount;
    if (typeof val === 'number') {
      return val.toLocaleString('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' RSD';
    }
    return (val || '—');
  }
  get payer(): string { return this.order?.name || this.order?.customerName || '—'; }
  get payerEmail(): string { return this.order?.email || this.order?.customerEmail || '—'; }
  get reference(): string { return this.order?.reference || this.order?.pozivNaBroj || this.orderId; }
  receiverName = environment.receiverName;
  receiverAccount = environment.receiverAccount;
  receiverAddress = environment.receiverAddress;
  receiverEmail = environment.receiverEmail;
  receiverPIB = environment.receiverPIB;
  receiverMB = environment.receiverMB;

  constructor(private orderService: OrderService, private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('currentOrder');
    this.order = stored ? JSON.parse(stored) : undefined;
    this.preview = this.route.snapshot.queryParamMap.get('preview') === 'true';

    if (this.preview && (!this.order || !this.order.id)) {
      this.order = {
        id: 'DEMO-2025-0002',
        total: 12990,
        name: 'Petar Petrovic',
        email: 'petar@example.com',
        reference: '00-2025-0002'
      };
      localStorage.setItem('currentOrder', JSON.stringify(this.order));
    }

    if (!this.preview && this.order?.id) {
      // obeleži porudžbinu kao neuspešnu
      this.orderService.updateOrderStatus(this.order.id, 'failed').subscribe();

      if (this.order?.email) {
        this.http.post(`${environment.apiUrl}/payment/failure`, {
          orderId: this.order.id,
          amount: this.order.total,
          email: this.order.email,
          paidAt: new Date().toISOString(),
          payerName: this.order.name,
          payerEmail: this.order.email,
          reference: this.order.reference || this.order.pozivNaBroj || this.order.id,
          receiverName: environment.receiverName,
          receiverAccount: environment.receiverAccount,
          receiverAddress: environment.receiverAddress,
          method: 'IPS skeniraj'
        }).subscribe({
          next: () => console.log('✉️ Mail neuspešnog plaćanja poslat korisniku'),
          error: (err) => console.error('❌ Greška pri slanju failure maila:', err)
        });
      }
    }
  }
}
