import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
  now = new Date();
  preview = false;

  // izvedena polja za prikaz
  get orderId(): string {
    return this.order?.id || '—';
  }
  get amount(): string {
    const val = this.order?.total ?? this.order?.amount;
    if (typeof val === 'number') {
      return val.toLocaleString('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' RSD';
    }
    return (val || '—');
  }
  get payer(): string {
    return this.order?.name || this.order?.customerName || '—';
  }
  get payerEmail(): string {
    return this.order?.email || this.order?.customerEmail || '—';
  }
  get reference(): string {
    // poziv na broj: koristi orderId ili nešto iz order.meta.reference
    return this.order?.reference || this.order?.pozivNaBroj || this.orderId;
  }
  receiverName = environment.receiverName;
  receiverAccount = environment.receiverAccount;
  receiverAddress = environment.receiverAddress;
  receiverEmail = environment.receiverEmail;
  receiverPIB = environment.receiverPIB;
  receiverMB = environment.receiverMB;

  constructor(
    private orderService: OrderService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('currentOrder');
    this.order = stored ? JSON.parse(stored) : undefined;
    this.preview = this.route.snapshot.queryParamMap.get('preview') === 'true';

    // Ako je preview i nema porudžbine u storage-u, popuni demo podacima
    if (this.preview && (!this.order || !this.order.id)) {
      this.order = {
        id: 'DEMO-2025-0001',
        total: 12990,
        name: 'Petar Petrovic',
        email: 'petar@example.com',
        reference: '00-2025-0001'
      };
      localStorage.setItem('currentOrder', JSON.stringify(this.order));
    }

    if (!this.preview && this.order?.id) {
      // 1️⃣ ažuriraj status porudžbine u bazi (ako koristiš Firebase / API)
      this.orderService.updateOrderStatus(this.order.id, 'paid').subscribe({
        next: () => console.log('📦 Order status updated to PAID')
      });

      // 2️⃣ pozovi backend /api/payment/confirm da pošalje email korisniku
      if (this.order?.email) {
        this.http.post(`${environment.apiUrl}/payment/confirm`, {
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
          next: () => console.log('📧 Mail potvrde poslat korisniku'),
          error: (err) => console.error('❌ Greška pri slanju maila:', err)
        });
      } else {
        console.warn('⚠️ Nema email adrese u localStorage (order.email).');
      }
    } else {
      if (!this.preview) {
        console.warn('⚠️ Nema aktivne porudžbine u localStorage.');
      }
    }

    // 3️⃣ Po želji očisti localStorage da ne ostane stara porudžbina
    // Napomena: ako želiš da detalji ostanu dostupni posle refresh-a, preskoči brisanje ili premesti ga na success/thank-you akciju korisnika.
    // localStorage.removeItem('currentOrder');
  }
}
