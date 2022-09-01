package com.digantasom.ecommerce.dao;

import com.digantasom.ecommerce.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.web.bind.annotation.RequestParam;

@RepositoryRestResource
public interface OrderRepository extends JpaRepository<Order, Long> {
  // http://localhost:8080/api/orders/search/by-customer-email?email=susan.smith@test.com
  @RestResource(path = "by-customer-email")
  Page<Order> findByCustomerEmail(@RequestParam String email, Pageable pageable);
}
