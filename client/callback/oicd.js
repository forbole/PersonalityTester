Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;
const oidcClient = new Oidc.OidcClient(config);
(async function() {
  try {
    const response = await oidcClient.processSigninResponse(location.href);
    const IDToken = response.id_token;
    const decoded = jwt_decode(IDToken);
    const address = decoded.sub;
    console.log(`ID token:\n${JSON.stringify(decoded, null, '')}`);
    document.getElementById('user-id').innerText = `${address}`;
    document.getElementById('grant-access-oasis').addEventListener('click', function () {
      location.assign(grantUrl(address));
    });
  } catch (error) {
    document.getElementById('user-id').hidden = true;
    document.getElementById('grant-access-oasis').hidden = true;
    document.getElementById('response').innerText = `${error}`;
  }
})();