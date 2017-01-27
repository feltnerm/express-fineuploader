var configHandler = function (options) {
  var routes = options.routes
  return function configHandler (req, res) {
    return res.send({
      routes: routes,
      uploadRequestParameters: options.uploadRequestParameters,
      features: {
        delete: !!routes.delete,
        uploadSuccess: !!routes.success
      }
    })
  }
}

module.exports = configHandler

