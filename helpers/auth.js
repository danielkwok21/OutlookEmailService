const azure = require('../private/azure')

const credentials = {
  client: {
    id: azure.app_id,
    secret: azure.client_secret,
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    authorizePath: 'common/oauth2/v2.0/authorize',
    tokenPath: 'common/oauth2/v2.0/token'
  }
}
const oauth2 = require('simple-oauth2').create(credentials)

function getAuthUrl() {
  const returnVal = oauth2.authorizationCode.authorizeURL({
    redirect_uri: azure.redirect_uri,
    scope: azure.app_scopes
  })
  // console.log(`Generated auth url: ${returnVal}`)
  return returnVal
}

async function getTokenFromCode(authCode){
  let result = await oauth2.authorizationCode.getToken({
    code: authCode,
    redirect_uri: azure.redirect_uri,
    scope: azure.app_scopes
  });
  
  const token = oauth2.accessToken.create(result);
  console.log('Token created: ', token.token);
  return token.token.access_token;
}

exports.getTokenFromCode = getTokenFromCode
exports.getAuthUrl = getAuthUrl