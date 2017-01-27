function successHandler (configuration) {
  return function (req, res, next) {
    var uuid = req.upload.uuid
    var filename = req.upload.filename
    var totalParts = req.upload.totalParts
    var baseUploadDirectory = configuration.baseUploadDirectory
    var finalUploadDirectory = configuration.finalUploadDirectory
    var chunksDirectory = configuration.chunksDirectory

    configuration.combineChunks(uuid, filename, totalParts, baseUploadDirectory, finalUploadDirectory, chunksDirectory, function (err, data) {
      if (err) {
        return next(err)
      } else {
        res.send(Object.assign({}, { success: true }))
      }
    })
  }
}

module.exports = successHandler
