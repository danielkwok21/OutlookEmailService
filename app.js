'use strict'
const http = require('http')
const fs = require('fs')
const os = require('os')
const path = require('path')
const express = require('express')
const app = express()
const config = require('./others/config')
const utils = require('./others/utils')

//sets view engine as the package ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './public/views'))
app.use(express.static('public'))


/**
 * Refresh frontend
 */
app.get('/', (req, res)=>{
    renderFrontEnd(res)
})

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