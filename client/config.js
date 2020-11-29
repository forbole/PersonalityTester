const AUTH_SERVER = 'https://auth.oasiscloud.io';

const config = {
  authority: AUTH_SERVER,
  metadata: {
    issuer: AUTH_SERVER,
    authorization_endpoint: AUTH_SERVER + '/oauth/authorize',
    jwks_uri: AUTH_SERVER + '/oauth/keys',
    token_endpoint: AUTH_SERVER + '/oauth/token',
  },
  client_id: '7a6c29fa-341b-471f-bcc9-12cbbd24dc36',
  redirect_uri: 'http://localhost:4050/callback',
  response_type: 'code',
  scope: 'openid',
  filterProtocolClaims: false,
  loadUserInfo: false,
  extraQueryParams: {
    audience: 'https://api.oasislabs.com/parcel',
  },
};
