/**
 * Read all paths within chunks directory, concat them into a single file, and
 * move them to the finalized file directory
 */
var mapRequestBodyToUploadParams = function mapRequestBodyToUploadParams (requestBody, uploadRequestParameters) {
  return Object.entries(uploadRequestParameters).reduce(function (accum, param) {
    var parameterKey = param[0]
    var parameterName = param[1]
    var uploadParam = requestBody[parameterName]
    if (uploadParam) {
      accum[parameterKey] = uploadParam
    }
    return accum
  }, {})
}

module.exports = {
  mapRequestBodyToUploadParams: mapRequestBodyToUploadParams
}
