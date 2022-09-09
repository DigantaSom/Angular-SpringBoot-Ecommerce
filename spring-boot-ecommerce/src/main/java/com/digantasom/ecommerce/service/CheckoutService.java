package com.digantasom.ecommerce.service;

import com.digantasom.ecommerce.dto.PaymentInfo;
import com.digantasom.ecommerce.dto.Purchase;
import com.digantasom.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {

  PurchaseResponse placeOrder(Purchase purchase);

  PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
