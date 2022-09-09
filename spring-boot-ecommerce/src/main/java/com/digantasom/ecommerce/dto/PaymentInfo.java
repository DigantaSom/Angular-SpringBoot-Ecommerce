package com.digantasom.ecommerce.dto;

import com.digantasom.ecommerce.entity.Address;
import lombok.Data;

@Data
public class PaymentInfo {
  private int amount; // e.g. 12.54 USD should be converted to the smallest denomination i.e. 1254 cents
  private String currency;
}
