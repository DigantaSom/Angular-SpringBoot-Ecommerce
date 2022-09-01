package com.digantasom.ecommerce.dao;

import com.digantasom.ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
  Customer findByEmail(String theEmail);
}
