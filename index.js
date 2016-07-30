'use strict'

var assign = require('xtend/mutable')
var dot = require('dot-prop')

module.exports = stripeErrback

var asyncMethods = [
  'card.createToken',
  'bankAccount.createToken',
  'piiData.createToken',
  'bitcoinReceiver.createReceiver',
  'bitcoinReceiver.pollReceiver',
  'bitcoinReceiver.getReceiver'
]

var syncMethods = [
  'setPublishableKey',
  'card.validateCardNumber',
  'card.validateExpiry',
  'card.validateCVC',
  'card.cardType',
  'bankAccount.validateRoutingNumber',
  'bankAccount.validateAccountNumber',
  'bitcoinReceiver.cancelReceiverPoll'
]

function stripeErrback (Stripe) {
  if (typeof Stripe !== 'function') throw new Error('Stripe.js must be provided')

  var stripe = {}

  asyncMethods.forEach(function (method) {
    var names = method.split('.')
    var receiverName = names[0]
    var methodName = names[1]
    dot.set(stripe, method, toErrback(methodName, Stripe[receiverName]))
  })

  syncMethods.forEach(function (method) {
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
