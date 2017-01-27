var assert = require('assert')

var express = require('express')
var bodyParser = require('body-parser')

var config = require('./lib/config')
var routeHandlers = require('./lib/routes')

var _getMethodFromRoute = function _getMethodFromRoute (route) {
  return route.method.toLowerCase()
}

/**
 * Hooks up the express router with middleware and handlers needed to handle
 * Fine Uploader traditional requests.
 */
var expressFineUploaderMiddleware = function expressFineUploaderMiddleware (options, multer) {
  options = options || {}
  var configuration = config(options)

  assert.ok(configuration, 'Problem generating configuration! Check your ' +
            'settings: ', options)

  // Setup base middleware(s)
  var router = express.Router()

  router.use(bodyParser.urlencoded({ extended: true }))
  router.use(bodyParser.json())

  var routes = configuration.routes
  var uploadRequestParameters = configuration.uploadRequestParameters

  assert.ok(routes, 'No routes!', configuration)
  assert.ok(uploadRequestParameters, 'No uploadRequestParameters!',
            configuration)

  // Expose config values for client-side options
  if (configuration.config) { // secure?
    router.get('/config', routeHandlers.configRoute(configuration))
  }

  if (routes.success) {
    router[_getMethodFromRoute(routes.success)](routes.success.path,
      routeHandlers.uploadParamsMiddleware(configuration),
      routeHandlers.successRoute(configuration))
  }

  if (routes.upload) {
    router[_getMethodFromRoute(routes.upload)](routes.upload.path,
      routeHandlers.uploadMiddleware(configuration),
      routeHandlers.uploadParamsMiddleware(configuration),
      routeHandlers.uploadRoute(configuration),
      routeHandlers.errorRoute(configuration))
  }

  if (routes.delete) {
    router[_getMethodFromRoute(routes.delete)](routes.delete.path,
      routeHandlers.uploadParamsMiddleware(configuration),
      routeHandlers.deleteRoute(configuration))
  }

  return router
}

module.exports = expressFineUploaderMiddleware
