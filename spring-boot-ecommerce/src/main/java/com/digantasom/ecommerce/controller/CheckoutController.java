package com.digantasom.ecommerce.controller;

import com.digantasom.ecommerce.dto.Purchase;
import com.digantasom.ecommerce.dto.PurchaseResponse;
import com.digantasom.ecommerce.service.CheckoutService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {
  private CheckoutService checkoutService;

  public CheckoutController(CheckoutService checkoutService) {
    this.checkoutService = checkoutService;
  }

  @PostMapping("/purchase")
  PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
    PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);
    return purchaseResponse;
  }
}
