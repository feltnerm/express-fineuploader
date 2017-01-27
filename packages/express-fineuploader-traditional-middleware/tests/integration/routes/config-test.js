var test = require('tape')
var request = require('request')

var createServer = require('../server')

test('GET /config', function (t) {
  t.plan(3)

  var server = createServer({
    config: true
  })

  var app = server.listen(8000, function () {
    request.get({
      url: 'http://localhost:8000/uploads/config',
      json: true
    }, onResponse)
  })

  function onResponse (err, res, body) {
    if (err) {
      t.end(err)
    }
    app.close()
    t.ok(body.routes, '/config has routes')
    t.ok(body.uploadRequestParameters, '/config has uploadRequestParameters')
    t.ok(body.features, '/config has features')
    t.end()
  }
})
