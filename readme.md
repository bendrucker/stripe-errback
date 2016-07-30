# stripe-errback [![Build Status](https://travis-ci.org/bendrucker/stripe-errback.svg?branch=master)](https://travis-ci.org/bendrucker/stripe-errback)

> Wrap Stripe.js async methods to use node-style callbacks


## Install

```
$ npm install --save stripe-errback
```


## Usage

```js
var stripeErrback = require('stripe-errback')

var stripe = stripeErrback(window.Stripe)

stripe.card.createToken(data, params, function (err, data) {
  if (err) { /* console.error(err) */ }
  else { /* token = data.id... */ }
})
```

## API

#### `stripeErrback(Stripe)` -> `object`

Wraps `window.Stripe` to call a Node-style callback (`function (err, data)`) with results instead of using Stripe's `function (status, response)` functions.

##### Stripe

*Required*  
Type: `function`

The Stripe.js browser library (`window.Stripe`).

The returned object wraps the following methods in addition to exposing utility methods:

* [`card.createToken`](https://stripe.com/docs/stripe.js#card-createToken)
* [`bankAccount.createToken`](https://stripe.com/docs/stripe.js#bank-account-createToken)
* [`piiData.createToken`](https://stripe.com/docs/stripe.js?#pii-data-createToken)
* [`bitcoinReceiver.createReceiver`](https://stripe.com/docs/stripe.js#bitcoinreceiver-createreceiver)
* [`bitcoinReceiver.pollReceiver`](https://stripe.com/docs/stripe.js#bitcoinreceiver-pollreceiver)
* `bitcoinReceiver.getReceiver` (undocumented)

This configuration is exposed as `stripeErrback.methods` with `{async, sync}` containing arrays of dot property paths.

## License

MIT © [Ben Drucker](http://bendrucker.me)
