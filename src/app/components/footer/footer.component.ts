import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="main-footer">
      <div class="footer-content">
        <span class="firm-name">{{ name }}</span>
        <span class="firm-address">{{ address }}</span>
        <span class="footer-year">© {{ year }}</span>
      </div>
    </footer>
  `,
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  name = environment.receiverName;
  address = environment.receiverAddress;
  email = environment.receiverEmail;
  account = environment.receiverAccount;
  year = new Date().getFullYear();
}
