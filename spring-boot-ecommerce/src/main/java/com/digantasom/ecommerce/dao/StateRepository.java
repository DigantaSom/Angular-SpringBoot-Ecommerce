package com.digantasom.ecommerce.dao;


import com.digantasom.ecommerce.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RepositoryRestResource
public interface StateRepository extends JpaRepository<State, Integer> {

  // http://localhost:8080/api/states/search/findByCountryCode?code=IN
  List<State> findByCountryCode(@RequestParam("code") String code);
}
