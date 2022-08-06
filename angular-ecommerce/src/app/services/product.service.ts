import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Product } from '../common/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl: string = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  getProductList(theCategoryId: number): Observable<Product[]> {
    const serachUrl: string = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.http
      .get<GetResponse>(serachUrl)
      .pipe(map((response) => response._embedded.products));
  }
}

interface GetResponse {
  _embedded: {
    products: Product[];
  };
}
