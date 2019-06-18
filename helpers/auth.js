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
  res.cookie('graph_user', user, {maxAge:3600000, httpOnly: true})
  res.cookie('graph_refresh_token', token.token.refresh_token, {maxAge: 7200000, httpOnly: true})
  res.cookie('graph_token_expires', token.token.expires_at.getTime(), {maxAge: 3600000, httpOnly: true})

  console.log('token saved...')
}

function clearCookies(res){
  res.clearCookie('graph_access_token', {maxAge: 3600000, httpOnly: true});
  res.clearCookie('graph_user', {maxAge: 3600000, httpOnly: true});
  res.clearCookie('graph_refresh_token', {maxAge: 7200000, httpOnly: true})
  res.clearCookie('graph_token_expires', {maxAge: 3600000, httpOnly: true})
}

async function getAccessToken(cookies, res){
  let token = cookies.graph_access_token

  if(token){
    const FIVE_MINS = 300000
    const expiration = new Date(parseFloat(cookies.graph_token_expires - FIVE_MINS))
    
    // token still valid
    if(expiration > new Date()){
      return token
    }
  }

  // token expire/not valid
  const refresh_token = cookies.graph_refresh_token
  if(refresh_token){
    const newToken = await oauth2.accessToken.create({refresh_token: refresh_token}).refresh()
    saveValuesToCookie(newToken, res)
    return newToken.token.access_token
  }

    return null
}

exports.getAccessToken = getAccessToken
exports.clearCookies = clearCookies
exports.getTokenFromCode = getTokenFromCode
exports.getAuthUrl = getAuthUrl