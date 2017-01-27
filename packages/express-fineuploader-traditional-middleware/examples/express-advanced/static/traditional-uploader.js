(function () {
  // using fetch because i have a 1337 browser
  var fetch = window.fetch
  var qq = window.qq || {}
  var ENDPOINT_PREFIX = '/uploads'

  function setupFineUploaderParams (serverConfig, fineUploaderConfig) {
    var params = serverConfig.uploadRequestParameters

    var requestOptions = {
      filenameParam: params.filename,
      inputName: params.inputParam,
      totalFileSizeName: params.totalFileSize,
      uuidName: params.uuid
    }

    var chunkingOptions = {
      paramNames: {
        chunkSize: params.chunkSize,
        partByteOffset: params.partByteOffset,
        partIndex: params.partIndex,
        totalParts: params.totalParts
      }
    }

    fineUploaderConfig.request = Object.assign({}, fineUploaderConfig.request, requestOptions)
    fineUploaderConfig.chunking = Object.assign({}, fineUploaderConfig.chunking, chunkingOptions)
    return fineUploaderConfig
  }

  function generateFineUploaderConfig (serverConfig) {
    var fineUploaderConfig = {
      element: document.getElementById('fineuploader-traditional'),
      debug: true,
      chunking: {
        concurrent: { enabled: true },
        success: {
          endpoint: `${ENDPOINT_PREFIX}/${serverConfig.routes.success}`
        },
        enabled: serverConfig.features.uploadSuccess
      },
      deleteFile: {
        enabled: serverConfig.features.delete
      },
      request: {
        endpoint: '/uploads'
      }
    }
    if (serverConfig.routes.success && serverConfig.features.uploadSuccess) {
      fineUploaderConfig.chunking.success = Object.assign({}, fineUploaderConfig.chunking.success, {
        endpoint: `${ENDPOINT_PREFIX}${serverConfig.routes.success.path}`
      })
    }

    if (serverConfig.routes.delete && serverConfig.features.delete) {
      var serverDeletePath = serverConfig.routes.delete.path
      var uuidPathIndex = serverDeletePath.indexOf(':uuid') // we want to strip off the :uuid part used in the express server configuration
      var deletePath = serverDeletePath.slice(0, uuidPathIndex)
      fineUploaderConfig.deleteFile = Object.assign({}, fineUploaderConfig.deleteFile, {
        endpoint: `${ENDPOINT_PREFIX}${deletePath}`
      })
    }

    if (serverConfig.routes.upload) {
      fineUploaderConfig.request = Object.assign({}, fineUploaderConfig.request, {
        endpoint: `${ENDPOINT_PREFIX}${serverConfig.routes.upload.path}`
      })
    }

    fineUploaderConfig = setupFineUploaderParams(serverConfig, fineUploaderConfig)
    return fineUploaderConfig
  }

  fetch(`${ENDPOINT_PREFIX}/config`)
  .then(function (response) {
    return response.json()
  })
  .then(generateFineUploaderConfig)
  .then(function (fineUploaderConfig) {
    var fineUploader = new qq.FineUploader(fineUploaderConfig)
    return fineUploader
  })
})()
