import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Purchase } from '../common/purchase';
import { PaymentInfo } from '../common/payment-info';

import { PurchaseResponse } from '../common/purchase-response';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private purchaseUrl: string = `${environment.luv2shopApiUrl}/checkout/purchase`;
  private paymentIntentUrl: string = `${environment.luv2shopApiUrl}/checkout/payment-intent`;

  constructor(private http: HttpClient) {}

  placeOrder(purchase: Purchase): Observable<PurchaseResponse> {
    return this.http.post<PurchaseResponse>(this.purchaseUrl, purchase);
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.http.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }
}
