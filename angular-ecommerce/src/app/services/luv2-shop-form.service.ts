import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root',
})
export class Luv2ShopFormService {
  private baseUrl: string = 'http://localhost:8080/api';
  private countriesUrl: string = `${this.baseUrl}/countries`;
  private statesUrl: string = `${this.baseUrl}/states`;

  constructor(private http: HttpClient) {}

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for (let month = startMonth; month <= 12; month++) {
      data.push(month);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let year = startYear; year <= endYear; year++) {
      data.push(year);
    }
    return of(data);
  }

  getCountries(): Observable<Country[]> {
    return this.http
      .get<GetResponseCountries>(this.countriesUrl)
      .pipe(map((response) => response._embedded.countries));
  }

  getStates(theCountryCode: string): Observable<State[]> {
    const searchUrl: string = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.http
      .get<GetResponseStates>(searchUrl)
      .pipe(map((response) => response._embedded.states));
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  };
}
