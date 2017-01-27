var configHandler = require('./config')
var uploadMiddleware = require('./upload').uploadMiddleware
var uploadHandler = require('./upload').uploadHandler
var uploadParamsMiddleware = require('./upload').uploadParamsMiddleware
var deleteHandler = require('./delete')
var successHandler = require('./success')
var errorHandler = require('./error')

module.exports = {
  configRoute: configHandler,
  deleteRoute: deleteHandler,
  errorRoute: errorHandler,
  successRoute: successHandler,
  uploadParamsMiddleware: uploadParamsMiddleware,
  uploadMiddleware: uploadMiddleware,
  uploadRoute: uploadHandler
}

