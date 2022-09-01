package com.digantasom.ecommerce.service;

import com.digantasom.ecommerce.dao.CustomerRepository;
import com.digantasom.ecommerce.dto.Purchase;
import com.digantasom.ecommerce.dto.PurchaseResponse;
import com.digantasom.ecommerce.entity.Customer;
import com.digantasom.ecommerce.entity.Order;
import com.digantasom.ecommerce.entity.OrderItem;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {
  private CustomerRepository customerRepository;

  // @Autowired here is optional since we only have one constructor
  public CheckoutServiceImpl(CustomerRepository customerRepository) {
    this.customerRepository = customerRepository;
  }

  @Override
  @Transactional
  public PurchaseResponse placeOrder(Purchase purchase) {
    // retrieve the order info from DTO (Data Transfer Object)
    Order order = purchase.getOrder();

    // generate tracking number
    String orderTrackingNumber = generateOrderTrackingNumber();
    order.setOrderTrackingNumber(orderTrackingNumber);

    // populate order with orderItems
    Set<OrderItem> orderItems = purchase.getOrderItems();
    orderItems.forEach(item -> order.add(item));

    // populate order with shippingAddress and billingAddress
    order.setShippingAddress(purchase.getShippingAddress());
    order.setBillingAddress(purchase.getBillingAddress());

    // populate customer with order
    Customer customer = purchase.getCustomer();

    // check if this is an existing customer
    String theEmail = customer.getEmail();
    Customer customerFromDB = customerRepository.findByEmail(theEmail);
    if (customerFromDB != null) {
      customer = customerFromDB;
    }

    customer.add(order);

    // save to the database
    customerRepository.save(customer);

    // return a response
    return new PurchaseResponse(orderTrackingNumber);
  }

  private String generateOrderTrackingNumber() {
    return UUID.randomUUID().toString(); // v4
  }
}
