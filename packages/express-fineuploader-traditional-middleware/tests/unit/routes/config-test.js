var test = require('tape')

var ConfigHandler = require('../../../lib/routes/config')

test('config route', function (t) {
  t.plan(1)

  var options = {
    routes: {},
    uploadRequestParameters: {}
  }
  var configHandler = ConfigHandler(options)

  var req = {}
  var res = {
    send: function (data) {
      t.deepEquals(data, {
        routes: {},
        uploadRequestParameters: {},
        features: {
          delete: false,
          uploadSuccess: false
        }
      }, 'Cofig route handler returns expected parameters')
      t.end()
    }
  }

  configHandler(req, res)
})
