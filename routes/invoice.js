require('dotenv').config()
const express = require('express')
const router = express.Router()
const BTCPAY_PRIV_KEY = process.env.BTCPAY_PRIV_KEY
const BTCPAY_MERCHANT_KEY = process.env.BTCPAY_MERCHANT_KEY

// Initialize the client
const btcpay = require('btcpay')
const keypair = btcpay.crypto.load_keypair(new Buffer.from(BTCPAY_PRIV_KEY, 'hex'))
const client = new btcpay.BTCPayClient('https://lightning.filipmartinsson.com', keypair, {merchant: BTCPAY_MERCHANT_KEY})

/* get & verify invoice. */
router.get('/:id', async function(req, res, next) {
    // Check if invoice is paid
    const invoiceId = req.params.id
    client.get_invoice(invoiceId)
    .then(invoice => {
        if(invoice == 'complete' || invoice.status == 'paid') {
            // Deliver ride to customer
            res.end('<html>Thank you!</html>')
        } else {
            res.end('<html>Not paid!</html')
        }
    })
    .catch(err => {
        console.log(err)
    })
})

/* Create invoice. */
router.post('/', (req, res, next) => {
    const product = JSON.parse(req.body.product)
    const dollarAmount = product.price
    console.log(dollarAmount)
    client.create_invoice({
        price: dollarAmount,
        currency: 'USD',
        notificationURL: 'https://litrides.herokuapp.com/invoice/webhook'
    })
    .then(invoice => {
        console.log(invoice)
        res.render('invoice', {invoiceId: invoice.id})
    })
    .catch(err => console.log(err))
})

// Post --> /invoice/webhook
router.post('/webhook', (req, res, next) => {
    // Deliver car
})

module.exports = router
