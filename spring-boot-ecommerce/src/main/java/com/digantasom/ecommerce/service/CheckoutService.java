package com.digantasom.ecommerce.service;

import com.digantasom.ecommerce.dto.Purchase;
import com.digantasom.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
  PurchaseResponse placeOrder(Purchase purchase);
}
