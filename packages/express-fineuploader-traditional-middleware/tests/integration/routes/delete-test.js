var test = require('tape')
var request = require('request')

var createServer = require('../server')

test('DELETE /:uuid', function (t) {
  t.plan(1)

  var server = createServer({
    config: true
  })

  var app = server.listen(8000, function () {
    var url = 'http://localhost:8000/uploads' + '/this-is-sort-of-a-uuid'
    request.delete({
      url: url,
      json: true
    }, onResponse)
  })

  function onResponse (err, res, body) {
    if (err) {
      t.end(err)
    }
    app.close()
    t.equals(res.statusCode, 200, '200 status code on delete')
    t.end()
  }
})

