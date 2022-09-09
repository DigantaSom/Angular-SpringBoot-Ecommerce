import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { PaymentInfo } from 'src/app/common/payment-info';

import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

import { environment } from 'src/environments/environment';

interface CustomerForm {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
}
interface AddressForm {
  country: FormControl<string | null>;
  street: FormControl<string | null>;
  city: FormControl<string | null>;
  state: FormControl<string | null>;
  zipCode: FormControl<string | null>;
}
/*
  interface CreditCardForm {
    cardType: FormControl<string | null>;
    nameOnCard: FormControl<string | null>;
    cardNumber: FormControl<string | null>;
    securityCode: FormControl<string | null>;
    expirationMonth: FormControl<string | null>;
    expirationYear: FormControl<string | null>;
  }
*/

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;
  totalPriceSub: Subscription;
  totalQuantitySub: Subscription;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  // Initialize the Stripe API
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: HTMLElement;

  userEmail = JSON.parse(sessionStorage.getItem('userEmail')!);
  userFullName = JSON.parse(sessionStorage.getItem('userFullName')!);

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private luv2ShopFormService: Luv2ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit(): void {
    this.setupStripePaymentForm();

    this.reviewCartDetails();

    // initialize form
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group<CustomerForm>({
        firstName: new FormControl(this.userFullName.split(' ')[0].trim(), [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
        ]),
        lastName: new FormControl(this.userFullName.split(' ')[1].trim(), [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
        ]),
        email: new FormControl(this.userEmail, [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      shippingAddress: this.formBuilder.group<AddressForm>({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
        ]),
        state: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
        ]),
      }),
      billingAddress: this.formBuilder.group<AddressForm>({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
        ]),
        state: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
        ]),
      }),
      creditCard: this.formBuilder.group({
        /*
          cardType: new FormControl('', Validators.required),
          nameOnCard: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
            Luv2ShopValidators.notOnlyWhitespace,
          ]),
          cardNumber: new FormControl('', [
            Validators.required,
            Validators.pattern('[0-9]{16}'),
          ]),
          securityCode: new FormControl('', [
            Validators.required,
            Validators.pattern('[0-9]{3}'),
          ]),
          expirationMonth: new FormControl(''),
          expirationYear: new FormControl(''),
        */
      }),
    });

    /*
      // populate credit card months
      const startMonth: number = new Date().getMonth() + 1;
      this.luv2ShopFormService
        .getCreditCardMonths(startMonth)
        .subscribe((data) => {
          this.creditCardMonths = data;
        });

      // populate credit card years
      this.luv2ShopFormService.getCreditCardYears().subscribe((data) => {
        this.creditCardYears = data;
      });
    */

    // populate countries
    this.luv2ShopFormService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  ngOnDestroy(): void {
    this.totalPriceSub.unsubscribe();
    this.totalQuantitySub.unsubscribe();
  }

  // getter methods for customer form controls
  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }
  // getter methods for shipping-address form controls
  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  // getter methods for billing-address form controls
  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }
  // getter methods for credit-card form controls
  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  onSubmit(): void {
    console.log(this.checkoutFormGroup);

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order();
    order.totalQuantity = this.totalQuantity;
    order.totalPrice = this.totalPrice;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    const orderItems = cartItems.map((cartItem) => new OrderItem(cartItem));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;

    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;

    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    const billingCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // Compute payment info
    // Making dollars to cents for Stripe. Also, Math.round() is used for JS float number to Java int conversion
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = 'INR'; // changing to INR here, to avoid Stripe purchase failure

    console.log(`this.paymentInfo.amount: ${this.paymentInfo.amount}`);

    // if form is valid, then
    // - create payment intent
    // - confirm card payment
    // - place order
    if (
      !this.checkoutFormGroup.invalid &&
      this.displayError.textContent === ''
    ) {
      this.checkoutService
        .createPaymentIntent(this.paymentInfo)
        .subscribe((paymentIntentResponse) => {
          console.log(
            'paymentIntentResponse: ' + JSON.stringify(paymentIntentResponse)
          );
          this.stripe
            .confirmCardPayment(
              paymentIntentResponse.client_secret,
              {
                payment_method: {
                  card: this.cardElement,
                },
              },
              { handleActions: false }
            )
            .then((result: any) => {
              if (result.error) {
                alert(`There was an error: ${result.error.message}`);
              } else {
                // call REST API via the CheckoutService
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response) => {
                    alert(
                      `Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`
                    );
                    this.resetCart();
                  },
                  error: (err) => {
                    alert(`There was an error: ${err.message}`);
                  },
                });
              }
            });
        });
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }

  copyShippingAddressToBillingAddress(event: Event): void {
    const isChecked: boolean = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYear(): void {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup!.value.expirationYear
    );

    // if the current year equals selected year, then start with the current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.luv2ShopFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        this.creditCardMonths = data;
      });
  }

  // populating states based on country for shipping-address and billing-address, individually
  getStates(formGroupName: 'shippingAddress' | 'billingAddress'): void {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode: string = formGroup!.value.country.code;

    this.luv2ShopFormService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }
    });
  }

  private setupStripePaymentForm(): void {
    // get a handle to stripe elements
    const elements = this.stripe.elements();

    // create a card element, and hide the zip-code field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    // add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {
      this.displayError = document.getElementById('card-errors')!;

      if (event.complete) {
        this.displayError.textContent = '';
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    });
  }

  private reviewCartDetails(): void {
    this.totalPriceSub = this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data;
    });
    this.totalQuantitySub = this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });
  }

  private resetCart(): void {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems(); // removing cartItems from localStorage

    this.checkoutFormGroup.reset();
    localStorage.removeItem('cartItems');

    this.router.navigateByUrl('/products');
  }
}
