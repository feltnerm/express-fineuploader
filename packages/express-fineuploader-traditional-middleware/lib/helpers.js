/**
 * Read all paths within chunks directory, concat them into a single file, and
 * move them to the finalized file directory
 */
var mapRequestBodyToUploadParams = function mapRequestBodyToUploadParams (requestBody, uploadRequestParameters) {
  return Object.keys(uploadRequestParameters).reduce(function (accum, parameterKey) {
    var parameterName = uploadRequestParameters[parameterKey]
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
