package com.digantasom.ecommerce.dao;

import com.digantasom.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin("http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product, Long> {

  // http://localhost:8080/api/products/search/findByCategoryId?id=2
  Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable);

  // http://localhost:8080/api/products/search/findByNameContainingIgnoreCase?name=something
  Page<Product> findByNameContainingIgnoreCase(@RequestParam("name") String name, Pageable pageable);
}
