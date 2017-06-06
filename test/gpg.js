const assert = require('assert')
const tmp = require('tmp')
const fs = require('fs-extra')
// const gapp = require('./lib/gapp.js')
const gpg = require('../lib/gpg.js')

describe('gpg', function() {
  describe('setup', function() {
    before(function() {
      tmp.dir(function _tempDirCreated(err, path, cleanupCallback) {
        if (err) done(err)
        process.env['PERSPECTIVE'] = path
      })
    })
    it('should list secret keys', function(done) {
      gpg.listSecretKeys()
        .then((keys) => {
          assert(Object.keys(keys).length > 0)
          done()
        })
    })
  })
})
