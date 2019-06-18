const azure = require('../private/azure')
const jwt = require('jsonwebtoken')

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

async function getTokenFromCode(authCode, res){
  let result = await oauth2.authorizationCode.getToken({
    code: authCode,
    redirect_uri: azure.redirect_uri,
    scope: azure.app_scopes
  });

  const token = oauth2.accessToken.create(result);
  console.log('token created...');

  saveValuesToCookie(token, res)

  return token.token.access_token;
}

function saveValuesToCookie(token, res){
  const user = jwt.decode(token.token.id_token)
  res.cookie('graph_access_token', token.token.access_token, {maxAge: 3600000, httpOnly: true})
  res.cookie('graph_user_name', user, {maxAge:3600000, httpOnly: true})

  console.log('token saved...')
}

exports.getTokenFromCode = getTokenFromCode
exports.getAuthUrl = getAuthUrl