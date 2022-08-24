package com.digantasom.ecommerce.dto;

import com.digantasom.ecommerce.entity.Address;
import com.digantasom.ecommerce.entity.Customer;
import com.digantasom.ecommerce.entity.Order;
import com.digantasom.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
  private Customer customer;
  private Address shippingAddress;
  private Address billingAddress;
  private Order order;
  private Set<OrderItem> orderItems; // collection, but JSON will convert it into a JSON Array
}
