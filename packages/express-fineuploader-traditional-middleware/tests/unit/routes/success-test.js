var os = require('os')

var test = require('tape')

var SuccessHandler = require('../../../lib/routes/success')

test('success route', function (t) {
  t.plan(1)

  var req = {
    upload: {
      uuid: '34gf43',
      filename: 'derp.png',
      totalParts: 42
    }
  }
  var res = {
    send: function (data) {
      t.deepEquals(data, { success: true }, 'Success route handler returns expected parameters')
      t.end()
    }
  }
  var options = {
    baseUploadDirectory: os.tmpdir(),
    finalUploadDirectory: 'final',
    chunksDirectory: 'chunks'
  }

  function combineChunks (uuid, filename, totalParts, baseUploadDirectory, finalUploadDirectory, chunksDirectory, cb) {
    cb(null, '')
  }

  options.combineChunks = combineChunks

  var successHandler = SuccessHandler(options)

  successHandler(req, res)
})

