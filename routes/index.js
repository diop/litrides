'use strict'
const express = require('express')
const router = express.Router()
const smartcar = require('smartcar')
const port = 8000
let access = null

const client = new smartcar.AuthClient({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  requireUri: process.env.REDIRECT_URI,
  testMode: true,
})

router.get('/', function(request, response, next) {
  request.render('index', { title: 'Bitcoin Lightning', message: "Welcome to Litrides" })
})

router.get('/login', (request, response) => {
  const authURL = client.getAuthUrl()

  response.render('login', {
    url: authURL
  })
})

router.get('/exchange', (request, response) => {
  const code = request.query.code

  return client.exchangeCode(code)
    .then(_access => {
      // Never do in production
      access = _access
      response.redirect('/vehicle')
    })
})

router.get('/vehicle', (request, response) => {
  return smartcar.getVehicleIds(access.accessToken)
    .then(datas => {
      return vehicle.info()
    })
    .then(vehicleIds => {
      const vehicle = new smartcar.Vehicle(vehicleIds[0], access.accessToken)
      return vehicle.info()
    })
    .then(info => {
      response.render('vehicle', {
        info: info
      })
    })
})

module.exports = router