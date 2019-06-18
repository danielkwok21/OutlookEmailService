'use strict'
const https = require('https')
const fs = require('fs')
const os = require('os')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
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

/**
 * Refresh frontend
 */
app.get('/', (req, res)=>{
    renderFrontEnd(res)
})

app.get('/authorize', async (req, res)=>{
    // Get auth code
    const code = req.query.code;
    let token;
    try {
        token = await authHelper.getTokenFromCode(code);
        res.send(token)
    }catch (error) {
        res.send('error in getting token')
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