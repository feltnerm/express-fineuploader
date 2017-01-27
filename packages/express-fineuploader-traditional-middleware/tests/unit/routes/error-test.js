var test = require('tape')

var ErrorHandler = require('../../../lib/routes/error')

test('error handler handles errors', function (t) {
  t.plan(2)

  var err = {
    message: 'Major Malfunction!'
  }
  var req = {}
  var res = {
    status: function (statusCode) {
      t.equals(statusCode, 500, 'Status code is a 500 on a server error')
      return {
        send: function (data) {
          t.deepEquals(data, { success: false, error: err.message })
          t.end()
        }
      }
    }
  }
  var next = function () {
    t.fail('next should _not_ be called here')
  }

  var errorHandler = ErrorHandler({})
  errorHandler(err, req, res, next)
})

test('error handler passes thru non-errors', function (t) {
  var req = {}
  var res = {
    status: function (statusCode) {
      t.fail('status should _not_ be called here')
    },
    send: function (data) {
      t.fail('Send should _not_ be called here')
    }
  }

  var next = function () {
    t.end()
  }

  var errorHandler = ErrorHandler({})
  errorHandler(undefined, req, res, next)
})
