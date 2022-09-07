import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { from, lastValueFrom, Observable } from 'rxjs';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Promise<HttpEvent<unknown>> {
    // only add an access token for secured endpoints
    const secureEndpoints: string[] = [
      `${environment.backendBaseUrl}/api/orders`,
    ];

    if (secureEndpoints.some((url) => request.urlWithParams.includes(url))) {
      // get the access token
      const accessToken = await this.oktaAuth.getAccessToken();

      // clone the request and add a new header with this access token
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
    }

    return await lastValueFrom(next.handle(request));
  }
}
