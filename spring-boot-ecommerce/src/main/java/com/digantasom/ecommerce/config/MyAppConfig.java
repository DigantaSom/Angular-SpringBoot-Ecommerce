package com.digantasom.ecommerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MyAppConfig implements WebMvcConfigurer {
  @Value("${allowed.origins}")
  private String[] theAllowedOrigins;

  @Value("${spring.data.rest.base-path}")
  private String basePath;

  // this method adds CORS mapping only for RestControllers of this app
  @Override
  public void addCorsMappings(CorsRegistry cors) {
    // WebMvcConfigurer.super.addCorsMappings(cors);

    // set up CORS mapping
    cors.addMapping(basePath + "/**").allowedOrigins(theAllowedOrigins);
  }
}
