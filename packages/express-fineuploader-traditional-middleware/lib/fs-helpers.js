var assert = require('assert')
var fs = require('fs')
var path = require('path')
var util = require('util')

var CombinedStream = require('combined-stream')
var mkdirp = require('mkdirp')
var rimraf = require('rimraf')

/**
 * turns a UUID into a nice path. example: abcdef -> a/b/c/d/abcdef
 * @param {string} uuid
 * @return {string} A path, split by the UUIDs leading characters
 */
var uuidToDirectory = function uuidToDirectory (uuid) {
  assert.ok(uuid && uuid.length >= 4, 'Invalid UUID: ' + uuid)
  return path.join(uuid[0], uuid[1], uuid[2], uuid[3], uuid)
}

/**
 * generates the parent directory for an uploaded file or a chunk of an uploaded file
 * @param {string} uuid - the upload's UUID
 * @param {string} baseUploadDirectory - path to the directory where final uploads and chunks are stored
 * @param {finalUploadDirectory} - the name of the directory where final uploads are stored within the `baseUploadDirectory`
 * @param {boolean} isChunked - whether this path represents a chunk or not (if `true` then the rest of the parameters are required)
 * @param {string} chunksDirectory - the name of the directory where chunks are stored within the `baseUploadDirectory`
 * @return {string}
 */
var generateDestination = function generateDestination (uuid, baseUploadDirectory, finalUploadDirectory, isChunked, chunksDirectory) {
  var directory = uuidToDirectory(uuid)

  if (isChunked) {
    return path.join(baseUploadDirectory, chunksDirectory, directory)
  }
  return path.join(baseUploadDirectory, finalUploadDirectory, directory)
}

/**
 * generates the filename for an uploaded file or a chunk of an uploaded file
 * @param {string} uuid - the upload's UUID
 * @param {string} filename - the upload's filename
 * @param {boolean} isChunked - whether this path represents a chunk or not (if `true` then the rest of the parameters are required)
 * @param {Number} partIndex - the index of this particular chunk in an array of chunks representing a file
 * @return {string}
 */
var generateFilename = function generateFilename (uuid, filename, isChunked, partIndex) {
  if (isChunked) {
    return util.format('%s-%s-%s', partIndex, uuid, filename)
  }
  return util.format('%s-%s', uuid, filename)
}

/**
 * generates the full path to an uploaded file or a chunk of an uploaded file
 * @param {string} uuid - the upload's UUID
 * @param {string} filename - the upload's filename
 * @param {string} baseUploadDirectory - path to the directory where final uploads and chunks are stored
 * @param {boolean} isChunked - whether this path represents a chunk or not (if `true` then the rest of the parameters are required)
 * @param {string} chunksDirectory - the name of the directory where chunks are stored within the `baseUploadDirectory`
 * @param {Number} partIndex - the index of this particular chunk in an array of chunks representing a file
 * @return {string}
 */
var generateFullUploadPath = function generateFullUploadpath (uuid, inputFilename, baseUploadDirectory, finalUploadDirectory, isChunked, chunksDirectory, partIndex) {
  var destination = generateDestination(uuid, baseUploadDirectory, finalUploadDirectory, isChunked, chunksDirectory)
  var filename = generateFilename(uuid, inputFilename, isChunked, partIndex)
  return path.join(destination, filename)
}

/**
 * Combines the chunks of a file into a single file.
 * @param {string} uuid - the upload's UUID
 * @param {string} filename - the upload's filename
 * @param {Number} totalParts - the index of this particular chunk in an array of chunks representing a file
 * @param {string} baseUploadDirectory - path to the directory where final uploads and chunks are stored
 * @param {boolean} isChunked - whether this path represents a chunk or not (if `true` then the rest of the parameters are required)
 * @param {string} chunksDirectory - the name of the directory where chunks are stored within the `baseUploadDirectory`
 * @param {Number} partIndex - the index of this particular chunk in an array of chunks representing a file
 * @param {function} cb - a callback with (err, combinedFilename)
 */
var combineChunks = function combineChunks (uuid, filename, totalParts, baseUploadDirectory, finalUploadDirectory, chunksDirectory, cb) {
  totalParts = parseInt(totalParts, 10)
  filename = filename || 'blob' // @todo: configurable

  assert.ok(totalParts > 0, 'Invalid `totalParts` parameter from upload request: ' + totalParts)
  assert.ok(uuid && uuid.length > 0, 'Invalid `uuid` parameter from upload request: ' + uuid)

  var inputDirectory = generateDestination(uuid, baseUploadDirectory, finalUploadDirectory, true, chunksDirectory)

  var chunkFilenames = []
  // implicitly sorted [0...totalparts)
  for (var n = 0; n < totalParts; n++) {
    var filenameOnDisk = generateFullUploadPath(uuid, filename, baseUploadDirectory, finalUploadDirectory, true, chunksDirectory, n)
    chunkFilenames.push(filenameOnDisk)
  }

  var outputDirectory = generateDestination(uuid, baseUploadDirectory, finalUploadDirectory)
  var outputFile = generateFullUploadPath(uuid, filename, baseUploadDirectory, finalUploadDirectory)

  // @todo: validate we have all the chunks
  // var numChunks = req.totalParts - 1

  var combinedChunksStream = CombinedStream.create()
  chunkFilenames.forEach(function (chunkFilename) {
    var fileStream = fs.createReadStream(chunkFilename)
    combinedChunksStream.append(fileStream)
  })

  combinedChunksStream.on('error', function (err) {
    rimraf(outputDirectory, function (rimrafError) {
      cb(err || rimrafError)
    })
  })

  // @todo: ?
  // combinedChunksStream.on('close', function () {
  //   console.log('closing')
  //   rimraf(inputDirectory, function (err) {
  //     cb(err)
  //   })
  // })

  combinedChunksStream.on('end', function () {
    rimraf(inputDirectory, function (err) {
      cb(err, outputFile)
    })
  })

  mkdirp(outputDirectory, function (err) {
    if (err) {
      return cb(err)
    }
    var outputFileStream = fs.createWriteStream(outputFile)
    combinedChunksStream.pipe(outputFileStream)
  })
}

module.exports = {
  combineChunks: combineChunks,
  uuidToDirectory: uuidToDirectory,
  generateDestination: generateDestination,
  generateFilename: generateFilename,
  generateFullUploadPath: generateFullUploadPath
}
