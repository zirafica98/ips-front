import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl.replace('/api', '')}/api/payment`;

  constructor(private http: HttpClient) {}

  /**
   * Kreira IPS plaćanje i vraća URL QR koda.
   * Ako backend nije aktivan, vraća fake QR kod za testiranje.
   */
  createPayment(orderId: string, amount: number): Observable<{ qrCodeURL: string }> {
    // pokušaj slanja ka backendu
    return this.http.post<{ qrCodeURL: string }>(`${this.apiUrl}/create`, { orderId, amount }).pipe(
      catchError((error) => {
        console.warn('⚠️ Backend nedostupan, koristimo fake QR:', error?.message);
        const data = encodeURIComponent(`ORDER:${orderId}|AMOUNT:${amount}RSD|IPS-TEST`);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${data}`;
        return of({ qrCodeURL: qrUrl });
      })
    );
  }

  /**
   * Proverava status plaćanja.
   * Ako backend nije aktivan, simulira uspešno plaćanje.
   */
  checkPaymentStatus(orderId: string, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/status`, { orderId, amount }).pipe(
      catchError((error) => {
        console.warn('⚠️ Backend nedostupan, vraćamo fake status:', error?.message);
        const fakeStatus = {
          responseCode: '00',
          message: 'Plaćanje uspešno (test mod)',
          orderId,
          amount
        };
        return of(fakeStatus);
      })
    );
  }
}
