// Generated by CoffeeScript 1.6.3
var EventEmitter, Uploader, async, aws,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EventEmitter = require('events').EventEmitter;

async = require('async');

aws = require('aws-sdk');

Uploader = (function(_super) {
  __extends(Uploader, _super);

  function Uploader(_arg, cb) {
    var accessKey, bucket, debug, maxBufferSize, objectName, objectParams, partSize, region, secretKey, sessionToken, stream, waitForPartAttempts, waitTime, _base, _base1, _base2,
      _this = this;
    accessKey = _arg.accessKey, secretKey = _arg.secretKey, sessionToken = _arg.sessionToken, region = _arg.region, stream = _arg.stream, objectName = _arg.objectName, objectParams = _arg.objectParams, bucket = _arg.bucket, partSize = _arg.partSize, maxBufferSize = _arg.maxBufferSize, waitForPartAttempts = _arg.waitForPartAttempts, waitTime = _arg.waitTime, debug = _arg.debug;
    this.cb = cb;
    Uploader.__super__.constructor.call(this);
    aws.config.update({
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
      sessionToken: sessionToken,
      region: region ? region : void 0
    });
    this.objectName = objectName;
    this.objectParams = objectParams || {};
    if ((_base = this.objectParams).Bucket == null) {
      _base.Bucket = bucket;
    }
    if ((_base1 = this.objectParams).Key == null) {
      _base1.Key = objectName;
    }
    if ((_base2 = this.objectParams).Body == null) {
      _base2.Body = stream;
    }
    this.timeout = 300000;
    this.debug = debug || false;
    if (!this.objectParams.Bucket) {
      throw new Error("Bucket must be given");
    }
    this.upload = new aws.S3.ManagedUpload({
      partSize: 10 * 1024 * 1024,
      queueSize: 1,
      params: this.objectParams
    });
    this.upload.minPartSize = 1024 * 1024 * 5;
    this.upload.queueSize = 4;
    this.upload.on('httpUploadProgress', function(progress) {
      if (_this.debug) {
        return console.log("" + progress.loaded + " / " + progress.total);
      }
    });
  }

  Uploader.prototype.send = function(callback) {
    return this.upload.send(function(err, data) {
      if (err) {
        console.log(err, data);
      }
      return callback(err, data);
    });
  };

  return Uploader;

})(EventEmitter);

module.exports = {
  Uploader: Uploader
};
