'use strict'
const path = require('path')
const os = require('os')
const homedir = os.homedir()
const Promise = require('bluebird')
const fs = require('fs-extra')
const gitconfig = require('gitconfig')
const git = require('./git')

function setupPerspective (username, pass, email, fingerprint) {
  git.cfgget()
    .then((config) => {
      if (config && config.user && config.user.username) {
        if (config.user.signingkey && (!config.commit.gpgsign || config.user.signingkey.length < 12))
          return this.getFingerprint(config.user.email)
        else
          this.fingerprint = config.user.signingkey
        }
      })
}

class Perspective {
  constructor(perspective) {
    if (perspective) {
      this.path = perspective
      process.chdir(this.path)
    }
    var self = this
    git.cfgget()
      .then((config) => {
        if (config && config.user && config.user.username) {
          if (!self.path) {
            self.path = path.join(os.homedir(), config.user.username)
            process.chdir(self.path)
          }
          self.name = config.user.username
          self.email = config.user.email
          self.fingerprint = config.user.signingkey
        } else throw new Error("No perspective found, run setup.")
      })
  }

  loadPerspective() {
    fs.access(this.path)
      .catch((err) => {
        fs.mkdir(this.path).then(chdir)
      }).then(chdir)
  }
}

// class Gapp {
//   constructor(gap) {
//     this.name = gap.name
//     this.version = gap.version || '0.0.1'
//     this.path = gap.path
//     this.observer = gap.observer
//     this.dependencies = gap.dependencies
//     this.perspective = process.env.PERSPECTIVE || path.normalize()
//     fs.access(this.perspective)
//       .catch((err) => {
//         fs.mkdir(this.perspective).then(this.loadPerspective)
//       }).then(this.loadPerspective)
//   }
//
//   loadPerspective () {
//     process.chdir(this.perspective)
//   }
// }

module.exports = {'setupPerspective': setupPerspective, 'Perspective': Perspective}
