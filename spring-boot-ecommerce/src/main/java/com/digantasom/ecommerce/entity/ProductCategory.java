package com.digantasom.ecommerce.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Set;

@Entity
@Data // could be a bug for 1-n or n-1 relationships, instead use @Getter and @Setter if needed
public class ProductCategory {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String categoryName;

  @OneToMany(cascade = CascadeType.ALL, mappedBy = "category")
  private Set<Product> products;
}
