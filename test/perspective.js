const os = require('os')
const path = require('path')
const assert = require('assert')
const tmp = require('tmp')
const fs = require('fs-extra')
const Perspective = require('../lib/perspective.js')
var confPath = path.join(os.homedir(), 'blocktree', 'ghconfig.json')

describe('perspective', function () {
  // describe('config', function () {
  //   it('load and save an encrypted config file', function (done) {
  //     Perspective.loadConfig().then(done)
  //     // Perspective.saveConfig({''})
  //   })
  // })
  // describe('loading', function() {
  //   it('should return is-not-alive for empty perspective', function(done) {
  //     tmp.dir(function _tempDirCreated(err, path, cleanupCallback) {
  //       if (err) done(err)
  //       process.env['PERSPECTIVE'] = path
  //       var guld = Guld()
  //       assert !guld.isAlive()
  //     })
  //   })
  //   it('should create PERSPECTIVE if none is present', function(done) {
  //     tmp.dir(function _tempDirCreated(err, path, cleanupCallback) {
  //       if (err) done(err)
  //       process.env['PERSPECTIVE'] = path
  //       var guld = Guld()
  //       fs.access(process.env.PERSPECTIVE)
  //         .catch((err) => {
  //           done(err)
  //         }).then(done)
  //     })
  //   })
  // })
})
