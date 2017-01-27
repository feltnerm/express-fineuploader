var fs = require('fs')
var os = require('os')
var util = require('util')

var test = require('tape')

var fsHelpers = require('../../lib/fs-helpers')
var testUtils = require('./utils')

test('uuidToDirectory', function (t) {
  t.plan(1)
  var uuid = '1basf-42f4-afta-as5g' // i made this up
  var result = fsHelpers.uuidToDirectory(uuid)
  t.equal(result, '1/b/a/s/' + uuid)
})

test('non-chunked generate filename', function (t) {
  t.plan(1)

  var uuid = '34634y63g'
  var filename = 'derp.png'

  var result = fsHelpers.generateFilename(uuid, filename)

  t.equals(result, util.format('%s-%s', uuid, filename), 'Non-chunked upload filename')
})

test('chunked generate filename', function (t) {
  t.plan(1)

  var uuid = '34t34tg3ga'
  var partIndex = 42
  var filename = 'derp.png'

  var result = fsHelpers.generateFilename(uuid, filename, true, partIndex)

  t.equals(result, util.format('%s-%s-%s', partIndex, uuid, filename), 'Chunked uploads have a partIndex in their filename')
})

test('non-chunked generate destination (directory)', function (t) {
  t.plan(1)

  var uuid = '34t535'
  var splitUuid = fsHelpers.uuidToDirectory(uuid)
  var baseUploadDirectory = os.tmpdir()
  var finalUploadDirectory = 'final'

  var result = fsHelpers.generateDestination(uuid, baseUploadDirectory, finalUploadDirectory)

  t.equals(result, util.format('%s/%s/%s', baseUploadDirectory, finalUploadDirectory, splitUuid), 'non-chunked upload directories are unique')
})

test('chunked generate destination (directory)', function (t) {
  t.plan(1)

  var uuid = '34t535'
  var splitUuid = fsHelpers.uuidToDirectory(uuid)
  var baseUploadDirectory = os.tmpdir()
  var finalUploadDirectory = 'final'
  var chunksDirectory = 'chunks'

  var result = fsHelpers.generateDestination(uuid, baseUploadDirectory, finalUploadDirectory, true, chunksDirectory)

  t.equals(result, util.format('%s/%s/%s', baseUploadDirectory, chunksDirectory, splitUuid), 'non-chunked upload directories are unique')
})

test('combineChunks', function (t) {
  t.plan(3)

  var baseUploadDirectory = os.tmpdir()
  var chunksDirectory = 'chunks'
  var finalUploadDirectory = 'final'
  var uuid = '3q452546'
  var inputFilename = 'do.dat'
  var totalParts = 10

  var size = 10

  var expectedSize = totalParts * size
  var expectedOutputFilename = fsHelpers.generateFullUploadPath(uuid, inputFilename, baseUploadDirectory, finalUploadDirectory)

  testUtils.mktmpFiles(totalParts, size, uuid, inputFilename, baseUploadDirectory, finalUploadDirectory, true, chunksDirectory, function (err, files) {
    t.equals(files.length, totalParts, 'temporary chunks were generated')
    if (err) {
      return t.end(err)
    }
    fsHelpers.combineChunks(uuid, inputFilename, totalParts, baseUploadDirectory, finalUploadDirectory, chunksDirectory, function (err, file) {
      if (err) {
        return t.end(err)
      }
      t.equals(file, expectedOutputFilename, 'Filename matches expected output')
      fs.stat(file, function (err, stats) {
        if (err) {
          return t.end(err)
        }
        t.equals(stats.size, expectedSize, 'Combined file equals size of its chunks')
        t.end()
      })
    })
  })
})
