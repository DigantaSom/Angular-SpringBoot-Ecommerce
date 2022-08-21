package com.digantasom.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
public class Country {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  private String code;
  private String name;

  @OneToMany(mappedBy = "country")
  @JsonIgnore // ignores the states[] in 'countries' JSON endpoint
  private List<State> states;
}
