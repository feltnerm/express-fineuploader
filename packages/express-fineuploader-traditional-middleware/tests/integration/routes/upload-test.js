var util = require('util')
var os = require('os')

var async = require('async')
var test = require('tape')
var request = require('request')
var UUID = require('uuid')

var createServer = require('../server')

var config = require('../../../lib/config')

test('POST /upload - non-chunked', function (t) {
  t.plan(1)

  var baseUploadDirectory = os.tmpdir()
  var server = createServer({
    config: true,
    baseUploadDirectory: baseUploadDirectory
  })

  var emptyBuffer = Buffer.alloc(100) // 100 bytes
  var app = server.listen(8000, function () {
    request.post({
      url: 'http://localhost:8000/uploads',
      json: true,
      formData: {
        qquuid: UUID.v4(),
        qqfilename: 'derp.dat',
        qqtotalfilesize: 100,
        qqfile: {
          value: emptyBuffer,
          options: {
            filename: 'blob', // don't forget to send a filename or multer will ignore it!
            contentType: 'application/octet-stream'
          }
        }
      }
    }, onResponse)
  })

  function onResponse (err, res, body) {
    if (err) {
      t.end(err)
    }
    app.close()
    t.ok(body.success, '/upload success')
    t.end()
  }
})

test('POST /upload - chunked', function (t) {
  t.plan(10)

  var baseUploadDirectory = os.tmpdir()
  var configuration = config({
    config: true,
    routes: {
      success: false
    },
    baseUploadDirectory: baseUploadDirectory
  })

  var server = createServer(configuration)

  var uuid = UUID.v4()
  var helloBuffer = Buffer.from('hello')
  var app = server.listen(8000, function () {
    async.timesSeries(10, function (index, next) {
      request.post({
        url: 'http://localhost:8000/uploads',
        json: true,
        formData: {
          qqfilename: 'derp.dat',
          qqtotalfilesize: 10 * helloBuffer.length,
          qquuid: uuid,
          qqchunksize: helloBuffer.length,
          qqpartbyteoffset: index * helloBuffer.length,
          qqpartindex: index,
          qqtotalparts: 10,
          qqfile: {
            value: helloBuffer,
            options: {
              filename: 'blob', // don't forget to send a filename or multer will ignore it!
              contentType: 'application/octet-stream'
            }
          }
        }
      }, isLastResponse(index, 10, next))
    })
  })

  function isLastResponse (chunkIndex, totalChunks, cb) {
    return function onResponse (err, res, body) {
      if (err) {
        t.end(err)
        app.close()
        return cb(err)
      }
      t.ok(body.success, util.format('/upload chunk # %s/%s success', chunkIndex, totalChunks - 1))
      if (chunkIndex === totalChunks - 1) {
        app.close()
        t.end()
      }
      return cb()
    }
  }
})

test('POST /upload then /success - chunked', function (t) {
  t.plan(11)

  var baseUploadDirectory = os.tmpdir()
  var configuration = config({
    config: true,
    baseUploadDirectory: baseUploadDirectory
  })

  var server = createServer(configuration)

  var uuid = UUID.v4()
  var helloBuffer = Buffer.from('hello') // 100 bytes
  var app = server.listen(8000, function () {
    async.timesSeries(10, function (i, next) {
      return request.post({
        url: 'http://localhost:8000/uploads',
        json: true,
        formData: {
          qqfilename: 'derp.dat',
          qqtotalfilesize: 10 * 10,
          qquuid: uuid,
          qqchunksize: 10,
          qqpartbyteoffset: i * 10,
          qqpartindex: i,
          qqtotalparts: 10,
          qqfile: {
            value: helloBuffer,
            options: {
              filename: 'blob',
              contentType: 'application/octet-stream'
            }
          }
        }
      }, function (err, res, body) {
        if (err) {
          t.end(err)
        }
        t.ok(body.success, util.format('/upload chunk # %s/%s success', i, 10 - 1))
        next(err)
      })
    }, function (err, results) {
      if (err) {
        t.end(err)
      }
      request.post({
        url: 'http://localhost:8000/uploads/success',
        json: true,
        form: {
          qqfilename: 'derp.dat',
          qqtotalfilesize: 10 * 10,
          qqtotalparts: 10,
          qquuid: uuid
        }
      }, function (err, res, body) {
        if (err) {
          t.end(err)
        }
        t.ok(body.success, '/success')
        app.close()
        t.end()
      })
    })
  })
})

