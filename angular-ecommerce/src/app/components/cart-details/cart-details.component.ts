import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css'],
})
export class CartDetailsComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  totalPriceSub: Subscription;
  totalQuantitySub: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.listCartDetails();
  }

  ngOnDestroy(): void {
    this.totalPriceSub.unsubscribe();
    this.totalQuantitySub.unsubscribe();
  }

  incrementQuantity(cartItem: CartItem): void {
    this.cartService.addToCart(cartItem);
  }

  decrementQuantity(cartItem: CartItem): void {
    this.cartService.decrementQuantity(cartItem);
  }

  removeCartItem(cartItem: CartItem): void {
    this.cartService.removeItem(cartItem);
  }

  private listCartDetails(): void {
    // get a handle to the cart items
    this.cartItems = this.cartService.cartItems;

    // subscribe to the cart totalPrice
    this.totalPriceSub = this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data;
    });

    // subscribe to the cart totalQuantity
    this.totalQuantitySub = this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });

    // compute cart total price and quantity
    this.cartService.computeCartTotals();
  }
}
