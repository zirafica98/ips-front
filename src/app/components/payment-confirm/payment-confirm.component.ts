import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-confirm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-confirm.component.html',
  styleUrls: ['./payment-confirm.component.scss']
})
export class PaymentConfirmComponent {
  accepted = false;

  constructor(private router: Router) {}

  cancel() {
    this.router.navigate(['/cart']);
  }

  proceed() {
    if (!this.accepted) return;
    this.router.navigate(['/payment']);
  }
}
