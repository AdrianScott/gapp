const assert = require('assert')
const tmp = require('tmp')
const fs = require('fs-extra')
const gpg = require('../lib/gpg.js')

// run with
// export GNUPGHOME="$(mktemp -d)"

describe('gpg-gen', function () {
  it('should generate secret key', function (done) {
    // extremely long test
    this.timeout(900000)
    gpg.genKey({'name': 'test-member', 'email': 'test@guld.io'})
      .then(done)
      .catch(done)
  })
})
