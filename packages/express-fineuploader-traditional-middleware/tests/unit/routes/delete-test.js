var os = require('os')

var test = require('tape')

var DeleteHandler = require('../../../lib/routes/delete')

test('delete', function (t) {
  t.plan(1)

  var configuration = {
    baseUploadDirectory: os.tmpdir(),
    finalUploadDirectory: 'final'
  }
  var req = {
    params: {
      uuid: 'f43qf3qw4f3w'
    }
  }
  var res = {
    status: function (statusCode) {
      t.equals(statusCode, 200, 'Delete status code is 200')
      return {
        send: function (data) {
          t.end()
        }
      }
    }
  }

  var next = function (err) {
    t.end(err)
  }

  var deleteHandler = DeleteHandler(configuration)
  deleteHandler(req, res, next)
})
