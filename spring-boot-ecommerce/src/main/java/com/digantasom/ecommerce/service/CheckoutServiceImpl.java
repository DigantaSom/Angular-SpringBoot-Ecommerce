package com.digantasom.ecommerce.service;

import com.digantasom.ecommerce.dao.CustomerRepository;
import com.digantasom.ecommerce.dto.PaymentInfo;
import com.digantasom.ecommerce.dto.Purchase;
import com.digantasom.ecommerce.dto.PurchaseResponse;
import com.digantasom.ecommerce.entity.Customer;
import com.digantasom.ecommerce.entity.Order;
import com.digantasom.ecommerce.entity.OrderItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService {
  private CustomerRepository customerRepository;

  // @Autowired here is optional since we only have one constructor
  public CheckoutServiceImpl(
      CustomerRepository customerRepository,
      @Value("${stripe.key.secret}") String secretKey
  ) {
    this.customerRepository = customerRepository;
    // initialize Stripe API with secret key
    Stripe.apiKey = secretKey;
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

  @Override
  public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
    List<String> paymentMethodTypes = new ArrayList<>();
    paymentMethodTypes.add("card"); // we can add more later if we want

    Map<String, Object> params = new HashMap<>();
    params.put("amount", paymentInfo.getAmount());
    params.put("currency", paymentInfo.getCurrency());
    params.put("payment_method_types", paymentMethodTypes);
    params.put("description", paymentInfo.getDescription());

    return PaymentIntent.create(params);
  }

  private String generateOrderTrackingNumber() {
    return UUID.randomUUID().toString(); // v4
  }
}
