'use strict'
const os = require('os')
const path = require('path')
const perspective = require('./perspective.js')

module.exports = {
  'gapp': require('./gapp.js'),
  'gpg': require('./gpg.js'),
  'github': require('./github.js'),
  'perspective': perspective,
  GULDHOME: perspective.GULDHOME || path.join(os.homedir(), 'blocktree')
}
