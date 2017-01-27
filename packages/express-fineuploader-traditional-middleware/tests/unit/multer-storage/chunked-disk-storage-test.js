var os = require('os')

var test = require('tape')

var fsHelpers = require('../../../lib/fs-helpers')
var chunkedDiskStorage = require('../../../lib/multer-storage/chunked-disk-storage')

test('non-chunked chunkedDiskStorage destination generation', function (t) {
  t.plan(1)

  var options = {
    baseUploadDirectory: os.tmpdir(),
    finalUploadDirectory: 'final',
    chunksDirectory: 'chunks',
    uploadRequestParameters: {
      uuid: 'uuid'
    }
  }

  var storage = chunkedDiskStorage(options)

  var req = {
    body: {
      uuid: '346t525'
    }
  }

  var file = {}

  storage.destination(req, file, function (err, directory) {
    if (err) {
      t.end(err)
    }
    t.equals(directory, fsHelpers.generateDestination(req.body.uuid, options.baseUploadDirectory, options.finalUploadDirectory),
             'Generates the multer storage directory')
    t.end()
  })
})

test('chunked chunkedDiskStorage destination generation', function (t) {
  t.plan(1)

  var options = {
    baseUploadDirectory: os.tmpdir(),
    finalUploadDirectory: 'final',
    chunksDirectory: 'chunks',
    uploadRequestParameters: {
      uuid: 'uuid',
      partIndex: 'partIndex'
    }
  }

  var storage = chunkedDiskStorage(options)

  var req = {
    body: {
      uuid: '346t525',
      partIndex: 42
    }
  }

  var file = {}

  storage.destination(req, file, function (err, directory) {
    if (err) {
      t.end(err)
    }
    t.equals(directory, fsHelpers.generateDestination(req.body.uuid, options.baseUploadDirectory, options.finalUploadDirectory, true, options.chunksDirectory),
             'Generates the multer storage directory')
    t.end()
  })
})

test('non-chunked chunkedDiskStorage filename generation', function (t) {
  t.plan(1)

  var options = {
    baseUploadDirectory: os.tmpdir(),
    finalUploadDirectory: 'final',
    chunksDirectory: 'chunks',
    uploadRequestParameters: {
      uuid: 'uuid',
      filename: 'filename'
    }
  }

  var storage = chunkedDiskStorage(options)

  var req = {
    body: {
      uuid: '346t525',
      filename: 'derp.dat'
    }
  }

  var file = {}

  storage.filename(req, file, function (err, directory) {
    if (err) {
      t.end(err)
    }
    t.equals(directory, fsHelpers.generateFilename(req.body.uuid, req.body.filename),
             'Generates the multer storage directory')
    t.end()
  })
})

test('chunked chunkedDiskStorage filename generation', function (t) {
  t.plan(1)

  var options = {
    baseUploadDirectory: os.tmpdir(),
    finalUploadDirectory: 'final',
    chunksDirectory: 'chunks',
    uploadRequestParameters: {
      uuid: 'uuid',
      filename: 'filename',
      partIndex: 'partIndex'
    }
  }

  var storage = chunkedDiskStorage(options)

  var req = {
    body: {
      uuid: '346t525',
      filename: 'derp.dat',
      partIndex: 42
    }
  }

  var file = {}

  storage.filename(req, file, function (err, directory) {
    if (err) {
      t.end(err)
    }
    t.equals(directory, fsHelpers.generateFilename(req.body.uuid, req.body.filename, true, req.body.partIndex),
             'Generates the multer storage directory')
    t.end()
  })
})
