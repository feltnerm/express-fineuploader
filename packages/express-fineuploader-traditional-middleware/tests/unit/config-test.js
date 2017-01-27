var test = require('tape')

var config = require('../../lib/config')

test('config', function (t) {
  t.plan(3)
  t.ok(config(), 'Works with default options')
  t.ok(config({}), 'Works with empty options')
  t.ok(config({
    config: true
  }).config, 'Works with some options options')
})
