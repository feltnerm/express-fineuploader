var handleError = function handleError (options) {
  return function (err, req, res, next) {
    if (err) {
      console.error(err)
      return res.status(500).send(Object.assign({}, { success: false, error: err.message }))
    }
    next()
  }
}

module.exports = handleError

