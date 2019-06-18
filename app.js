'use strict'
const https = require('https')
const fs = require('fs')
const os = require('os')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cookieParser = require('cookie-parser')
const dotenvConfig = require('dotenv').config()

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
    try{
        const accessToken = req.cookies.graph_access_token
        const userName = req.cookies.graph_user_name
    
        if(accessToken && userName){
            renderFrontEnd(res, {accessToken:accessToken, userName:userName})
        }else{
            res.redirect('/signin')
        }
    }catch(err){
        renderFrontEnd(res, 'req.cookies error')
    }
})

app.get('/authorize', async (req, res)=>{
    // Get auth code
    const code = req.query.code;
    if(code){
        try {
            await authHelper.getTokenFromCode(code, res);
            
            res.redirect('/');
        }catch (error) {
            renderFrontEnd(res, { title: 'Error', message: 'Error exchanging code for token', error: error });
        }
    } else {
        // Otherwise complain
        renderFrontEnd(res, { title: 'Error', message: 'Authorization error', error: { status: 'Missing code parameter' } });
    }
})

app.get('/signin', (req, res)=>{
    const url = authHelper.getAuthUrl()

    res.redirect(url)
})


app.post('/email', (req, res)=>{
    let recipientPersonValues = []
    recipientPersonValues = getRecipientPersonValues(req.body.parcels)

    res.send(recipientPersonValues)
})

function getRecipientPersonValues(parcels){
    if(parcels){
        let recipientPersonValues = parcels
        .map(parcel=>parcel.result)
        .map(result=>result.recipientPersonValue)

        return recipientPersonValues
    }
    return []
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