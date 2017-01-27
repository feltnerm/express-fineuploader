(function () {
  var qq = window.qq || {}
  var fineUploader = new qq.FineUploader({
    element: document.getElementById('fineuploader-traditional'),
    debug: true,
    chunking: {
      concurrent: { enabled: true },
      success: {
        endpoint: '/uploads/success'
      },
      enabled: true
    },
    deleteFile: {
      endpoint: '/uploads',
      enabled: true
    },
    request: {
      endpoint: '/uploads'
    }
  })
  return fineUploader
})()
