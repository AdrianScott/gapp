const assert = require('assert')
const tmp = require('tmp')
const fs = require('fs-extra')
// const gapp = require('./lib/gapp.js')
const gpg = require('../lib/gpg.js')

describe('guld', function() {
  describe('setup', function() {
    before(function() {
      tmp.dir(function _tempDirCreated(err, path, cleanupCallback) {
        if (err) done(err)
        process.env['PERSPECTIVE'] = path
      })
    })
    // it('should import secret key', function(done) {
    //   gpg.exportKey()
    //     .then((keys) => {
    //       console.log(keys)
    //       assert(Object.keys(keys).length > 0)
    //       done()
    //     })
    // })
    // it('should generate secret keys', function(done) {
    //   gpg.listSecretKeys()
    //     .then((keys) => {
    //       console.log(keys)
    //       assert(Object.keys(keys).length > 0)
    //       done()
    //     })
    // })
  })
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
