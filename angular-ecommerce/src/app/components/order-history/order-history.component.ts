import { Component, OnInit } from '@angular/core';

import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {
  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) {}

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  private handleOrderHistory(): void {
    const userEmail = this.storage.getItem('userEmail');
    console.log(userEmail);

    if (userEmail) {
      this.orderHistoryService
        .getOrderHistory(JSON.parse(userEmail))
        .subscribe((data) => {
          console.log(data);

          this.orderHistoryList = data;
        });
    }
  }
}
