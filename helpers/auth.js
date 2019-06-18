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
  
  exports.getAuthUrl = getAuthUrl