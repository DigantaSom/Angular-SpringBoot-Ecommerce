import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  GetResponseProducts,
  ProductService,
} from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';

import { Product } from 'src/app/common/product';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = 'Book';
  searchMode: boolean = false;
  // new properties for pagination
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;
  previousKeyword: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts(): void {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  private handleListProducts(): void {
    // check if 'id' parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    } else {
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    // Check if we have a different category than previous
    // Note: Angular will reuse a component (not create new component) if it is currently being viewed

    // if we have a different category id than previous, then set pageNumber back to 1
    if (this.previousCategoryId !== this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(
      `currentCategoryId = ${this.currentCategoryId}, pageNumber = ${this.pageNumber}`
    );

    this.productService
      .getProductListPaginate(
        this.pageNumber - 1,
        this.pageSize,
        this.currentCategoryId
      )
      .subscribe(this.processResult());
  }

  private handleSearchProducts(): void {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // if we have a different keyword than previous, then set pageNumber to 1
    if (this.previousKeyword !== theKeyword) {
      this.pageNumber = 1;
    }
    this.previousKeyword = theKeyword;
    console.log(`keyword = ${theKeyword}, pageNumber = ${this.pageNumber}`);

    // now search for products using this keyword
    this.productService
      .searchProductsPaginate(theKeyword, this.pageNumber - 1, this.pageSize)
      .subscribe(this.processResult());
  }

  private processResult(): (data: GetResponseProducts) => void {
    return (data) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }

  updatePageSize(event: Event): void {
    const pageSize: number = +(event.target as HTMLSelectElement).value;

    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  addToCart(productToAdd: Product): void {
    const cartItem = new CartItem(productToAdd);
    this.cartService.addToCart(cartItem);
  }
}
