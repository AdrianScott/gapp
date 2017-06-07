'use strict'
const path = require('path')
const os = require('os')
const homedir = os.homedir()
const Promise = require('bluebird')
const fs = require('fs-extra')
const gitconfig = require('gitconfig')

class Gapp {
  constructor (gap) {
    this.name = gap.name
    this.version = gap.version || '0.0.1'
    this.path = gap.path
    this.observer = gap.observer
    this.dependencies = gap.dependencies
    this.perspective = process.env.PERSPECTIVE || path.join(homedir, 'blocktree')
    fs.access(this.perspective)
      .catch((err) => {
        fs.mkdir(this.perspective).then(this.loadPerspective)
      }).then(this.loadPerspective)
  }

  loadPerspective () {
    process.chdir(this.perspective)
  }
}

module.exports = Gapp
