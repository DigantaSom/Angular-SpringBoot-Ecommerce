import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  // storage: Storage = sessionStorage;
  storage: Storage = localStorage;

  constructor() {
    const cartItemsJson = this.storage.getItem('cartItems');

    if (cartItemsJson != null) {
      this.cartItems = JSON.parse(cartItemsJson);

      // compute totals based on the data that is read from storage
      this.computeCartTotals();
    }
  }

  addToCart(itemToAdd: CartItem): void {
    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined;

    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id
      existingCartItem = this.cartItems.find(
        (tempCartItem) => tempCartItem.id === itemToAdd.id
      );

      // check if we have found it
      alreadyExistsInCart = existingCartItem != undefined;
    }

    if (alreadyExistsInCart) {
      existingCartItem!.quantity++;
    } else {
      this.cartItems.push(itemToAdd);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity === 0) {
      return;
    }
    item.quantity--;

    if (item.quantity === 0) {
      this.removeItem(item);
    } else {
      this.computeCartTotals();
    }
  }

  removeItem(itemToRemove: CartItem): void {
    const itemIndex: number = this.cartItems.findIndex(
      (cartItem) => cartItem.id === itemToRemove.id
    );
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

  computeCartTotals(): void {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);

    // persist cart data
    this.persistCartItems();
  }

  private persistCartItems(): void {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  private logCartData(
    totalPriceValue: number,
    totalQuantityValue: number
  ): void {
    console.log('Contents of the cart');

    for (let tempCartItem of this.cartItems) {
      const { quantity, unitPrice, name } = tempCartItem;

      const subTotalPrice = quantity * unitPrice;
      console.log(
        `name: ${name}, quantity: ${quantity}, unitPrice: ${unitPrice}, subTotalPrice: ${subTotalPrice}`
      );
    }

    console.log(
      `totalPrice: ${totalPriceValue.toFixed(2)}, 
      totalQuantity: ${totalQuantityValue}`
    );
    console.log('----');
  }
}
