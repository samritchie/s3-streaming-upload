{assert}   = require 'chai'
fs         = require 'fs'
mktemp     = require 'mktemp'
{Uploader} = require '../../src/uploader'

describe '8MB file is piped to upload @integration test', ->
  buf      = ''
  source   = undefined
  reader   = undefined
  uploader = undefined
  filename = undefined

  before (done) ->
    for i in [1..8388608]
      buf += "0"
    source = new Buffer buf
    filename = mktemp.createFileSync 'XXXXX.tmp'
    fs.writeSync("/tmp/#{filename}", source)

    uploader = new Uploader
      accessKey: process.env.AWS_S3_ACCESS_KEY
      secretKey: process.env.AWS_S3_SECRET_KEY
      bucket:    process.env.AWS_S3_TEST_BUCKET
      objectName: "testfile" + new Date().getTime()

    reader = fs.createReadStream("/tmp/#{filename}").pipe(uploader)
    done()

  after (done) ->
    fs.exists filename, (exists) ->
      fs.unlinkSync(filename) if exists
      done()

  describe ' and when I write a file and finish', ->
    data = null

    before (done) ->
      @timeout parseInt process.env.TEST_TIMEOUT, 10 or 300000

      uploader.on 'completed', (err, returnedData) ->
        data = returnedData
        done err

      uploader.on 'failed', (err) ->
        done err

    it 'I have received ETag', ->
      assert.equal data.etag.length, 36
