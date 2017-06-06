const assert = require('assert')
const tmp = require('tmp')
const fs = require('fs-extra')
// const gapp = require('./lib/guld.js')
const gpg = require('../lib/gpg.js')

// run with
// export GNUPGHOME="$(mktemp -d)"

describe('gpg-gen', function() {
  before(function() {
    tmp.dir(function _tempDirCreated(err, path, cleanupCallback) {
      if (err) done(err)
      process.env['PERSPECTIVE'] = path
    })
  })
  // extremely long test
  it('should generate secret key', function(done) {
    this.timeout(900000)
    gpg.genKey({'name': 'test-member', 'email': 'test@guld.io'})
      .then(done)
      .catch(done)
  })
})
