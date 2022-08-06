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
    const serachUrl: string = `${this.productsUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.http
      .get<GetResponseProducts>(serachUrl)
      .pipe(map((response) => response._embedded.products));
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.http
      .get<GetResponseProductCategory>(`${this.categoryUrl}`)
      .pipe(map((response) => response._embedded.productCategory));
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
