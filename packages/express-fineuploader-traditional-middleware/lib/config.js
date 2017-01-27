var multer = require('multer')

var chunkedDiskStorage = require('./multer-storage/chunked-disk-storage')
var fsHelpers = require('./fs-helpers')

var config = function config (options) {
  options = options || {}

  var configuration = {
    /**
     * Whether to create an endpoint that returns configuration data
     * that can be used to initialize Fine Uploader
     * @type: boolean
     * @default: true
     */
    config: !!options.config,

    /**
     * An instance of a logger to use. Can either pass in your own instance,
     * or true (to use a built-in logger), or false to disable logging altogether.
     *
     * @todo
     * @type: boolean or instance of a logger
     * @default: true
     */
    logger: (function initLogger () {
      if (options.logger) {
        return options.logger
      }
      return 'dev'.indexOf((process.env.NODE_ENV || '').toLowerCase()) !== -1
    })(),

    /**
     * array of allowed mimetypes
     * @todo
     * @type: array
     * @default: [] (all)
     */
    allowedFiletypes: options.allowedFiletypes || undefined,

    /**
     * maximum allowed filesize
     * @todo
     * @type: number
     * @default: Infinity
     */
    maxFilesize: options.maxFilesize || Infinity,

    /**
     * predicate to filter files
     * @todo
     * @type: function
     * @default: returns true for all files
     */
    filesFilter: options.filesFilter || function () { return true },

    /**
     * validate that chunks were assembled properly
     * @todo
     * @type: function
     * @default: returns true for all files
     */
    validateChunks: options.validateChunks || function () { return true },

    /**
     * Remove chunks after final file is assembled?
     * @todo
     * @type: boolean
     * @default: true
     */
    removeChunks: !!options.removeChunks,

    /**
     * Base directory for all uploaded files
     * @type: string
     * @default: /tmp/uploads
     **/
    baseUploadDirectory: options.baseUploadDirectory || '/tmp/uploads',

    /**
     * sub-directory for all chunks
     * @type: string
     * @default: chunks
     **/
    chunksDirectory: options.chunksDirectory || 'chunks',

    /**
     * Base directory for all final files
     * @type: string
     * @default: final
     **/
    finalUploadDirectory: options.finalUploadDirectory || 'final',

    /**
     *
     * @type:
     * @default:
     */
    routes: Object.assign({
      'upload': {
        path: '/',
        method: 'POST'
      },
      'delete': {
        path: '/:uuid',
        method: 'DELETE'
      },
      'success': {
        path: '/success',
        method: 'POST'
      }
    }, options.routes),

    /**
     *
     * @type:
     * @default:
     */
    uploadRequestParameters: Object.assign({
      filename: 'qqfilename',
      inputParam: 'qqfile',
      totalFileSize: 'qqtotalfilesize',
      uuid: 'qquuid',
      // chunked uploads
      chunkSize: 'qqchunksize',
      partByteOffset: 'qqpartbyteoffset',
      partIndex: 'qqpartindex',
      totalParts: 'qqtotalparts'
    }, options.uploadRequestParameters),

    /**
     * multer configuration object
     * @type: object
     * @default: {}
     */
    multer: options.multer || undefined,

    /**
     *
     * @type: function
     * @params: options, req, cb
     * @default: lib/fs-helpers.combine_chunks
     */
    combineChunks: options.combineChunks || fsHelpers.combineChunks,

    /**
     * Callbacks
     * @todo
     */
    onUploadSuccess: options.onUploadSuccess || function () {},
    onBeforeUpload: options.onBeforeUpload || function () {},
    onAfterUpload: options.onBeforeUpload || function () {},
    onError: options.onBeforeUpload || function () {},
    onBeforeDelete: options.onBeforeUpload || function () {},
    onAfterDelete: options.onBeforeUpload || function () {}
  }

  // Setup our default multer disk storage callbacks.
  // If the user chooses to overwrite this then they'll need to change
  // their `onUploadSuccess`
  if (!configuration.multer) {
    configuration.multer = {
      storage: multer.diskStorage(chunkedDiskStorage(configuration))
    }
  }

  return configuration
}

module.exports = config

