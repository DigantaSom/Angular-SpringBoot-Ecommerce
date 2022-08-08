import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl: string = 'http://localhost:8080/api';
  private productsUrl: string = `${this.baseUrl}/products`;
  private categoryUrl: string = `${this.baseUrl}/product-category`;

  constructor(private http: HttpClient) {}

  getProductList(theCategoryId: number): Observable<Product[]> {
    const searchUrl: string = `${this.productsUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }

  getProductListPaginate(
    thePage: number,
    thePageSize: number,
    theCategoryId: number
  ): Observable<GetResponseProducts> {
    const searchUrl: string = `${this.productsUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;

    return this.http.get<GetResponseProducts>(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl: string = `${this.productsUrl}/search/findByNameContainingIgnoreCase?name=${theKeyword}`;
    return this.getProducts(searchUrl);
  }

  getProduct(productId: number): Observable<Product> {
    const productUrl: string = `${this.productsUrl}/${productId}`;
    return this.http.get<Product>(productUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.http
      .get<GetResponseProductCategory>(`${this.categoryUrl}`)
      .pipe(map((response) => response._embedded.productCategory));
  }

  private getProducts(url: string): Observable<Product[]> {
    return this.http
      .get<GetResponseProducts>(url)
      .pipe(map((response) => response._embedded.products));
  }
}

export interface GetResponseProducts {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
