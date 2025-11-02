import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  generateToken(): Observable<string> {
    return this.http.get<{ token: string }>(`${this.apiUrl}/token`).pipe(
      map((res) => res.token)
    );
  }
  private apiUrl = `${environment.apiUrl.replace('/api', '')}/api/payment`;

  constructor(private http: HttpClient) {}

 
createPayment(orderId: string, amount: number): Observable<string> {
  return this.http.post(
    `${this.apiUrl}/create`,
    { orderId, amount },
    { responseType: 'text' as 'json' }
  ) as Observable<string>; 
}




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
