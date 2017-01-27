var test = require('tape')

var helpers = require('../../lib/helpers')

test('mapRequestBodyToUploadParams', function (t) {
  t.plan(1)

  var requestParameters = {
    'a': 1,
    'b': 2
  }

  var requestBody = {
    1: 'foo',
    2: 'bar'
  }

  var result = helpers.mapRequestBodyToUploadParams(requestBody, requestParameters)

  t.deepEqual(result, {
    a: 'foo',
    b: 'bar'
  })
})
