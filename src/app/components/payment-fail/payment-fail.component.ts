import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-payment-fail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-fail.component.html',
  styleUrls: ['./payment-fail.component.scss']
})
export class PaymentFailComponent {
  message = '❌ Plaćanje neuspešno.';
  order: any;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.order = JSON.parse(localStorage.getItem('currentOrder') || '{}');

    if (this.order?.id) {
      // Opciono: obeleži porudžbinu kao neuspešnu
      this.orderService.updateOrderStatus(this.order.id, 'failed').subscribe();
    }
  }
}
