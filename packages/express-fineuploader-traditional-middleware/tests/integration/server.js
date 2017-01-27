// test server
var express = require('express')

var fineUploaderMiddleware = require('../../')

var createServer = function (options) {
  var app = express()
  app.use('/uploads', fineUploaderMiddleware(options))
  return app
}

module.exports = createServer
