var Multer = require('multer')

var helpers = require('../helpers')

function _setupMulterMiddleware (configuration) {
  // single-file Multer
  return Multer(configuration.multer)
    .single(configuration.uploadRequestParameters.inputParam)
}

var uploadParamsMiddleware = function uploadParamsMiddleware (configuration) {
  return function (req, res, next) {
    req.upload = {}
    req.upload = helpers.mapRequestBodyToUploadParams(req.body, configuration.uploadRequestParameters)
    next()
  }
}

var uploadMiddleware = function uploadMiddleware (configuration) {
  var multerMiddleware = _setupMulterMiddleware(configuration)

  return function (req, res, next) {
    multerMiddleware(req, res, function (err) {
      if (err) {
        return next(err)
      }
      next()
    })
  }
}

var _isFinalChunk = function (chunkData) {
  var partIndex = parseInt(chunkData.partIndex, 10)
  var totalParts = parseInt(chunkData.totalParts, 10)
  return partIndex === totalParts - 1
}

var uploadHandler = function uploadHandler (configuration) {
  return function (req, res, next) {
    var uuid = req.upload.uuid
    var filename = req.upload.filename
    var totalParts = req.upload.totalParts

    var baseUploadDirectory = configuration.baseUploadDirectory
    var finalUploadDirectory = configuration.finalUploadDirectory
    var chunksDirectory = configuration.chunksDirectory

    // if we are not supporting concurrent chunking or upload success endpoint
    if (!configuration.routes.success) {
      if (req.upload.partIndex && _isFinalChunk(req.upload)) {
        return configuration.combineChunks(uuid, filename, totalParts, baseUploadDirectory, finalUploadDirectory, chunksDirectory, function (err, data) {
          if (err) {
            return next(err)
          }
          return res.send(Object.assign({}, { success: true }))
        })
      } else {
        res.send(Object.assign({}, { success: true }))
        return
      }
    } else {
      res.send(Object.assign({}, { success: true }))
      return
    }
  }
}

module.exports = {
  uploadHandler: uploadHandler,
  uploadParamsMiddleware: uploadParamsMiddleware,
  uploadMiddleware: uploadMiddleware
}
