'use strict'
require('dotenv').config()
const express = require('express')
const router = express.Router()
const smartcar = require('smartcar')
let access = null

const client = new smartcar.AuthClient({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
  testMode: true,
})

router.get('/', function(request, response, next) {
  response.render('index', { title: 'Bitcoin Lightning', message: "Welcome to Litrides" })
})

// router.get('/login', (request, response) => {
//   const authURL = client.getAuthUrl()

//   response.render('login', {
//     url: authURL
//   })
// })

module.exports = router
