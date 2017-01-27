var test = require('tape')

var fineUploaderMiddleware = require('../../')

test('middleware initialization', function (t) {
  t.plan(3)

  t.ok(fineUploaderMiddleware(), 'no configuration')
  t.ok(fineUploaderMiddleware({}), 'empty configuration')
  t.ok(fineUploaderMiddleware({
    config: true
  }), 'can pass configuration through')
})
