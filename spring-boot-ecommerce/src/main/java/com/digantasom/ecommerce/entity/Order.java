package com.digantasom.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String orderTrackingNumber;
  private int totalQuantity;
  private BigDecimal totalPrice;
  private String status;

  @CreationTimestamp
  private Date dateCreated;

  @UpdateTimestamp
  private Date lastUpdated;

  @ManyToOne
  @JoinColumn(name = "customer_id")
  private Customer customer;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "shipping_address_id", referencedColumnName = "id")
  private Address shippingAddress;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "billing_address_id", referencedColumnName = "id")
  private Address billingAddress;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
  private Set<OrderItem> orderItems = new HashSet<>();

  public void add(OrderItem item) {
     if (item != null) {
       if (orderItems == null) {
         orderItems = new HashSet<>();
       }
       orderItems.add(item);
       item.setOrder(this); // to have bidirectional relationship set up
     }
  }
}
