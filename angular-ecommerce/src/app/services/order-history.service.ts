import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {
  private orderUrl: string = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  getOrderHistory(email: string): Observable<OrderHistory[]> {
    return this.http
      .get<GetResponseOrderHistory>(
        `${this.orderUrl}/search/by-customer-email?email=${email}&sort=dateCreated,DESC`
      )
      .pipe(map((response) => response._embedded.orders));
  }
}

interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  };
}
