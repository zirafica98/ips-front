import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent {
  constructor(private router: Router) {}

  chooseIPS() {
    // Za sada samo IPS kao metoda
    this.router.navigate(['/payment-confirm']);
  }
}
