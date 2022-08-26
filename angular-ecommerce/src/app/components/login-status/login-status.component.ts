import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css'],
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean | undefined = false;
  userFullName: string | undefined;

  constructor(
    private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe((result) => {
      this.isAuthenticated = result.isAuthenticated;
      this.getUserDetails();
    });
  }

  logout(): void {
    // Terminates the session with Okta and removes current tokens
    this.oktaAuth.signOut();
  }

  private getUserDetails(): void {
    if (this.isAuthenticated) {
      // Fetch the logged in user's details (user's claims)
      this.oktaAuth.getUser().then((res) => {
        this.userFullName = res.name;
      });
    }
  }
}
