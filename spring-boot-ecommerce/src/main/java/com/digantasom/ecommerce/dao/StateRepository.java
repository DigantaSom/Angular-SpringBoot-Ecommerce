package com.digantasom.ecommerce.dao;


import com.digantasom.ecommerce.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@CrossOrigin("http://localhost:4200")
public interface StateRepository extends JpaRepository<State, Integer> {

  // http://localhost:8080/api/states/search/findByCountryCode?code=IN
  List<State> findByCountryCode(@RequestParam("code") String code);
}
