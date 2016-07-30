'use strict'

var assign = require('xtend/mutable')
var dot = require('dot-prop')

var methods = stripeErrback.methods = {
  async: [
    'card.createToken',
    'bankAccount.createToken',
    'piiData.createToken',
    'bitcoinReceiver.createReceiver',
    'bitcoinReceiver.pollReceiver',
    'bitcoinReceiver.getReceiver'
  ],
  sync: [
    'setPublishableKey',
    'card.validateCardNumber',
    'card.validateExpiry',
    'card.validateCVC',
    'card.cardType',
    'bankAccount.validateRoutingNumber',
    'bankAccount.validateAccountNumber',
    'bitcoinReceiver.cancelReceiverPoll'
  ]
}

module.exports = stripeErrback

function stripeErrback (Stripe) {
  if (typeof Stripe !== 'function') throw new Error('Stripe.js must be provided')

  var stripe = {}

  methods.async.forEach(function (method) {
    var names = method.split('.')
    var receiverName = names[0]
    var methodName = names[1]
    dot.set(stripe, method, toErrback(methodName, Stripe[receiverName]))
  })

  methods.sync.forEach(function (method) {
    dot.set(stripe, method, dot.get(Stripe, method))
  })

  return stripe
}

function toErrback (method, receiver) {
  return function errback () {
    var args = Array.prototype.slice.call(arguments)
    var callback = args.pop()

    receiver[method].apply(receiver, args.concat(function onStripe (status, response) {
      if (response.error) return callback(assign(new Error(), response.error, {status: status}))
      callback(null, response)
    }))
  }
}
