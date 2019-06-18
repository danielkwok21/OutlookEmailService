const azure = require('../private/azure')

const credentials = {
    client: {
      id: azure.app_id,
      secret: azure.client_secret,
    },
    auth: azure.auth
  }
  const oauth2 = require('simple-oauth2').create(credentials)
  
  function getAuthUrl() {
    const returnVal = oauth2.authorizationCode.authorizeURL({
      redirect_uri: azure.redirect_url,
      scope: azure.app_scopes
    })
    // console.log(`Generated auth url: ${returnVal}`)
    return returnVal
  }
  
  exports.getAuthUrl = getAuthUrl