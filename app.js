'use strict'
const https = require('https')
const fs = require('fs')
const os = require('os')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cookieParser = require('cookie-parser')
const graph = require('@microsoft/microsoft-graph-client')

const config = require('./others/config')
const utils = require('./others/utils')
const authHelper = require('./helpers/auth')

//sets view engine as the package ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './public/views'))
app.use(express.static('public'))
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true }));
app.use(cookieParser())

/**
 * Refresh frontend
 */

app.get('/', (req, res)=>{
    renderFrontEnd(res)
})

app.get('/home', async (req, res)=>{
    const data = await getAccessTokenAndUser(req, res)
    renderFrontEnd(res, data)
})

async function getAccessTokenAndUser(req, res){
    try{
        const accessToken = await authHelper.getAccessToken(req.cookies, res)
        const user = req.cookies.graph_user
    
        if(accessToken && user){
            return {accessToken:accessToken, user:user}
        }
        console.log('signed out')
    }catch(err){
        console.log('req cookie error')
    }

    return 'unable to get token'
}

/**
 * Redirected URL. Will not be accessed directly
 */
app.get('/authorize', async (req, res)=>{
    const code = req.query.code;
    if(code){
        try {
            await authHelper.getTokenFromCode(code, res);
            
            res.redirect('/home');
        }catch (error) {
            renderFrontEnd(res, 'Error exchanging code for token');
        }
    } else {
        // Otherwise complain
        renderFrontEnd(res, 'Missing code parameter');
    }
})

app.get('/signin', (req, res)=>{
    const url = authHelper.getAuthUrl()

    res.redirect(url)
})

app.get('/signout', (req, res)=>{
    authHelper.clearCookies(res);
    
    res.redirect('/home');
});

/**
 * posts parcel object from HoppsAlgorithm
 * To do:
 * Implement name finding algorithm
 */
app.post('/parcel', (req, res)=>{
    let recipientPersonValues = []
    recipientPersonValues = getRecipientPersonValues(req.body.parcels)

    res.send(recipientPersonValues)

    function getRecipientPersonValues(parcels){
        if(parcels){
            let recipientPersonValues = parcels
            .map(parcel=>parcel.result)
            .map(result=>result.recipientPersonValue)

            return recipientPersonValues
        }
        return []
    }
})

/**
 * address book query
 * request with query object {displayName="John Doe"}
 */
app.get('/people', async (req, res)=>{
    const displayName = req.query.displayName

    const result = await graphAPIPeopleSearch(req, res, displayName)
    
    renderFrontEnd(res, result)
})

app.get('/sendEmail', (req, res)=>{

})


async function graphAPIPeopleSearch(req, res, displayName){
    const data = await getAccessTokenAndUser(req, res)
    const accessToken = data.accessToken
    const user = data.user

    if(accessToken && user){

        try{
            const client = graph.Client.init({
                authProvider: done=>{
                    done(null, accessToken)
                }
            })

            const queryString = '/me/people/?$search="'+displayName+'"'
            return await client
            .api(queryString)
            .get()
            
        }catch(err){
            return 'graph api error'
        }
    }else{
        return 'signed out'
    }

}


function renderFrontEnd(res, data={}){
    res.render('index.ejs', {
        data: JSON.stringify(data, null, 2)
    })
}

let port = process.env.PORT || config.port
app.listen(port, ()=>{
    console.log('Connection established')
    console.log('Go to localhost:'+port)
})