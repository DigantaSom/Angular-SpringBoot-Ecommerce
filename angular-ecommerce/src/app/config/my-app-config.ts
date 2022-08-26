import { environment } from 'src/environments/environment';

export default {
  oidc: {
    clientId: environment.clientId,
    // Issuer of tokens. It's the URL when authorizing with Okta Authorization Server
    issuer: `https://${environment.oktaDomain}/oauth2/default`,
    redirectUri: `${window.location.origin}/login/callback`,
    // openid: required for authentication requests.
    // profile: user's first name, last name, phone etc.
    // email: user's email address
    scopes: ['openid', 'profile', 'email'],
  },
};
