package com.digantasom.ecommerce.config;

import com.digantasom.ecommerce.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
  @Value("${allowed.origins}") // from application.yml
  String[] theAllowedOrigins;

  @Value("${spring.data.rest.base-path}")
  private String basePath;

  @Autowired
  private EntityManager entityManager;

  @Override
  public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
    // RepositoryRestConfigurer.super.configureRepositoryRestConfiguration(config, cors);

    HttpMethod[] theUnsupportedActions = {
        HttpMethod.POST,
        HttpMethod.PUT,
        HttpMethod.DELETE,
        HttpMethod.PATCH
    };

    // Disable HTTP methods: POST, PUT and DELETE
    disableHttpMethods(Product.class, config, theUnsupportedActions);
    disableHttpMethods(ProductCategory.class, config, theUnsupportedActions);
    disableHttpMethods(Country.class, config, theUnsupportedActions);
    disableHttpMethods(State.class, config, theUnsupportedActions);
    disableHttpMethods(Order.class, config, theUnsupportedActions);

    // call an internal helper method
    exposeIds(config);

    // configure CORS mapping (with this, we can remove @CrossOrigin from JPA repositories)
    cors.addMapping(basePath + "/**").allowedOrigins(theAllowedOrigins);
  }

  private void disableHttpMethods(
      Class theClass,
      RepositoryRestConfiguration config,
      HttpMethod[] theUnsupportedActions
  ) {
    config.getExposureConfiguration()
        .forDomainType(theClass)
        .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
        .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
  }

  // expose entity ids in product-category path of the endpoint
  private void exposeIds(RepositoryRestConfiguration config) {

    // - get a list of all entity classes form the entity manager
    Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

    // - create an array of the entity types
    List<Class> entityClasses = new ArrayList<>();

    // - get the entity types for the entities
    for (EntityType tempEntityType: entities) {
      entityClasses.add(tempEntityType.getJavaType());
    }

    // - expose the entity ids for the array of entity/domain types
    Class[] domainTypes = entityClasses.toArray(new Class[0]);
    config.exposeIdsFor(domainTypes);
  }
}
