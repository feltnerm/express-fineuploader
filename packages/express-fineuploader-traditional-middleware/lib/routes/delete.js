var rimraf = require('rimraf')

var fsHelpers = require('../fs-helpers')

function deleteHandler (configuration) {
  return function (req, res, next) {
    var uuid = req.params.uuid
    if (uuid) {
      var destination = fsHelpers.generateDestination(uuid, configuration.baseUploadDirectory, configuration.finalUploadDirectory)
      rimraf(destination, function (err, cb) {
        if (err) {
          return next(err)
        }
        return res.status(200).send()
      })
    } else {
      res.status(404).send()
    }
  }
}

module.exports = deleteHandler
