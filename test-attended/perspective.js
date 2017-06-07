const os = require('os')
const path = require('path')
const assert = require('assert')
const tmp = require('tmp')
const fs = require('fs-extra')
const gitconfig = require('gitconfig')
const Perspective = require('../lib/perspective.js')
var confPath = path.join(os.homedir(), 'blocktree', 'ghconfig.json')

describe('perspective', function () {
  describe('config', function () {
    this.timeout(10000)
    it('load and save an encrypted config file', function (done) {
      gitconfig.get({
        location: 'global'
      }).then((config) => {
        Perspective.init(config.user.username, 'github pass', config.user.email, config.user.signingkey)
      })
    })
  })
})
