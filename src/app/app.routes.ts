import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { PaymentComponent } from './components/payment/payment.component';
import { PaymentMethodComponent } from './components/payment-method/payment-method.component';
import { PaymentConfirmComponent } from './components/payment-confirm/payment-confirm.component';
import { TermsComponent } from './components/terms/terms.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { PaymentFailComponent } from './components/payment-fail/payment-fail.component';
import { PaymentCancelComponent } from './components/payment-cancel/payment-cancel.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'payment-method', component: PaymentMethodComponent },
  { path: 'payment-confirm', component: PaymentConfirmComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'payment-success', component: PaymentSuccessComponent },
  { path: 'payment-fail', component: PaymentFailComponent },
  { path: 'payment-cancel', component: PaymentCancelComponent },
];
