import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { Purchase } from '../common/purchase';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private purchaseUrl: string = `${environment.backendBaseUrl}/api/checkout/purchase`;

  constructor(private http: HttpClient) {}

  placeOrder(purchase: Purchase): Observable<any> {
    return this.http.post<Purchase>(this.purchaseUrl, purchase);
  }
}
