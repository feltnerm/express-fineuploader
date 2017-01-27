var os = require('os')

var test = require('tape')

var UploadHandlers = require('../../../lib/routes/upload')

test('upload parameters are set on the request object', function (t) {
  var configuration = {
    uploadRequestParameters: {
      uuid: 'qquuid',
      filename: 'qqfilename'
    }
  }

  var uploadParamsMiddleware = UploadHandlers.uploadParamsMiddleware(configuration)

  var req = {
    body: {
      qquuid: '4wffwf',
      qqfilename: 'derp.dat'
    }
  }

  var res = {}
  var next = function () {
    t.end()
  }

  uploadParamsMiddleware(req, res, next)
})

test('multer middleware takes file request', function (t) {
  var configuration = {
    multer: {},
    uploadRequestParameters: {
      inputParam: 'qqfile'
    }
  }

  var req = {
    headers: {
      'transfer-encoding': ''
    },
    upload: {
      uuid: 'f43w4f',
      filename: 'asdf3q4f'
    }
  }
  var res = {}
  var next = function (err) {
    t.end(err)
  }

  var uploadMiddleware = UploadHandlers.uploadMiddleware(configuration)
  uploadMiddleware(req, res, next)
})

test('uploadHandler w/ success route', function (t) {
  t.plan(1)

  var configuration = {
    baseUploadDirectory: os.tmpdir(),
    finalUploadDirectory: 'final',
    chunksDirectory: 'chunks',
    routes: {
      success: {}
    }
  }

  var req = {
    body: {},
    file: {},
    files: {},
    upload: {
      uuid: '34f4w3f',
      filename: 'derp.dat',
      totalParts: 42
    }
  }
  var res = {
    send: function (data) {
      t.deepEquals(data, { success: true }, 'Success')
      t.end()
    }
  }
  var uploadHandler = UploadHandlers.uploadHandler(configuration)
  uploadHandler(req, res, function () {})
})

test('uploadHandler w/out success route - no combine', function (t) {
  t.plan(1)

  var configuration = {
    baseUploadDirectory: os.tmpdir(),
    finalUploadDirectory: 'final',
    chunksDirectory: 'chunks',
    routes: {}
  }

  var req = {
    body: {},
    file: {},
    files: {},
    upload: {
      uuid: '34f4w3f',
      filename: 'derp.dat',
      partIndex: 40,
      totalParts: 42
    }
  }
  var res = {
    send: function (data) {
      t.deepEquals(data, { success: true }, 'Success')
      t.end()
    }
  }
  var uploadHandler = UploadHandlers.uploadHandler(configuration)
  uploadHandler(req, res, function () {})
})

test('uploadHandler w/out success route - combine', function (t) {
  t.plan(2)

  var req = {
    body: {},
    file: {},
    files: {},
    upload: {
      uuid: '34f4w3f',
      filename: 'derp.dat',
      partIndex: 41,
      totalParts: 42
    }
  }

  var res = {
    send: function (data) {
      t.deepEquals(data, { success: true }, 'Success')
      t.end()
    }
  }

  var configuration = {
    baseUploadDirectory: os.tmpdir(),
    finalUploadDirectory: 'final',
    chunksDirectory: 'chunks',
    combineChunks: function (uuid, filename, totalparts, baseUploadDirectory, finalUploadDirectory, chunksDirectory, cb) {
      t.equals(uuid, req.upload.uuid)
      cb()
    },
    routes: {}
  }
  var uploadHandler = UploadHandlers.uploadHandler(configuration)
  uploadHandler(req, res, function () {})
})
