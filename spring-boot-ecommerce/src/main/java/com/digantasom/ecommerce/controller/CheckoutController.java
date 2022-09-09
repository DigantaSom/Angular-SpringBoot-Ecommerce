package com.digantasom.ecommerce.controller;

import com.digantasom.ecommerce.dto.PaymentInfo;
import com.digantasom.ecommerce.dto.Purchase;
import com.digantasom.ecommerce.dto.PurchaseResponse;
import com.digantasom.ecommerce.service.CheckoutService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {
  private Logger logger = Logger.getLogger(getClass().getName());
  private CheckoutService checkoutService;

  public CheckoutController(CheckoutService checkoutService) {
    this.checkoutService = checkoutService;
  }

  @PostMapping("/purchase")
  PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
    PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);
    return purchaseResponse;
  }

  @PostMapping("/payment-intent")
  public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfo paymentInfo) throws StripeException {

    logger.info("paymentInfo.amount: " + paymentInfo.getAmount());

    PaymentIntent paymentIntent = this.checkoutService.createPaymentIntent(paymentInfo);

    String paymentStr = paymentIntent.toJson();

    return new ResponseEntity<>(paymentStr, HttpStatus.OK);
  }
}
