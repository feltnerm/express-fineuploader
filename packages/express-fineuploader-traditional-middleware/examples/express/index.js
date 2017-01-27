// Express example
var express = require('express')

var fineUploaderMiddleware = require('../../')

var createServer = function () {
  var app = express()
  app.use('/uploads', fineUploaderMiddleware({
    config: true
  }))
  app.use(express.static('static'))
  return app
}

var server = createServer()
server.listen(8000, function () {
  console.log('listening!')
})
