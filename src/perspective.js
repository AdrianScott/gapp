const os = require('os')
const fs = require('fs-extra')
const path = require('path')
const gitconfig = require('gitconfig')
const Git = require('simple-git')
const github = require('./github')
const gpg = require('./gpg')
const GULDHOME = process.env.GULDHOME || path.join(os.homedir(), 'blocktree')
const CFGPATH = path.join(GULDHOME, 'config.json')
var gitCfg

var cfgget = () => {
  return new Promise((resolve, reject) => {
    function getGlobal () {
      gitconfig.get({
        location: 'global'
      }).then(resolve).catch(reject)
    }
    gitconfig.get({
      location: 'local'
    }).then((config) => {
      if (config.user && config.user.signingkey) resolve(config)
      else getGlobal()
    }).catch((err) => {
      getGlobal()
    })
  })
}

module.exports = class Perspective {
  constructor () {
    this.path = GULDHOME
    process.chdir(this.path)
    this.git = Git(GULDHOME)
    var self = this
    cfgget()
      .then((config) => {
        if (config && config.user && config.user.username) {
          self.name = config.user.username
          self.email = config.user.email
          self.fingerprint = config.user.signingkey
          self.loadConfig(self.fingerprint).then((config) => {
            self.github = github.getGithub({}, config.githubOAUTH)
          })
        } else throw new Error('No perspective found, run setup.')
      })
  }

  isReady () {
    return this.hasOwnProperty('github')
  }

  static loadConfig () {
    return new Promise((resolve, reject) => {
      gpg.gpg.decryptFile(CFGPATH, function(err, contents) {
        if (err) reject(err)
        else resolve(contents)
      })
    })
  }

  static saveConfig (config, fingerprint) {
    return new Promise((resolve, reject) => {
      gpg.gpg.encrypt(JSON.stringify(config), ['-r', fingerprint, '--yes', '-a'], function(err, data) {
        if (err) reject(err)
        else {
          fs.writeFile(CFGPATH, data).then(resolve).catch(reject)
        }
      })
    })
  }

  static init (username, pass, email, fingerprint) {
    var git
    gitCfg = {
      'user.username': username,
      'user.email': email,
      'commit.gpgsign': true
    }
    var getFingSafe = () => {
      return new Promise((resolve, reject) => {
        if (fingerprint) gitCfg['user.signingkey'] = resolve(fingerprint)
        else {
          gpg.genKey(username, email)
          .then(() => {
            getFingerprint(email).then(resolve)
          }).catch(reject)
        }
      })
    }

    var initAll = () => {
      process.chdir(GULDHOME)
      git = Git(GULDHOME).init()
      return fs.mkdir('life')
      .then(() => {fs.mkdir('life/' + username)})
      .then(() => {fs.mkdir('media')})
      .then(() => {fs.mkdir('tech')})
      .then(() => {fs.mkdir('keys')})
      .then(() => {fs.mkdir('keys/pgp')})
      .then(() => {fs.writeFile('.gitignore', 'node_modules\nconfig.json*')})
      .then(() => {git.add('.gitignore')})
      .then(getFingSafe)
      .then(addKey)
    }

    var addKey = (fingerprint) => {
      gitCfg['user.signingkey'] = fingerprint
      gitconfig.set(gitCfg, {location: 'global'})
      fs.writeFile('life/' + username + '/gap.json', JSON.stringify({
        "name": username,
        "fingerprint": fingerprint,
        "observer": username
      }, null, 2))
      gpg.gpg.call('', ['--export', '-a', fingerprint], (err, data) => {
        if (err) reject(err)
        else {
          var keypath = path.join('keys', 'pgp', username + '.asc')
          fs.writeFile(keypath, data.toString('utf-8')).then(() => {
            git.add(keypath)
            github.createGHToken({username: username, password: pass})
            .then((token) => {
              Perspective.saveConfig({'githubOAUTH': token}, fingerprint).then(resolve)
            })
          })
        }
      })
    }

    return fs.access(GULDHOME)
    .catch((err) => {
      fs.mkdir(GULDHOME).then(initAll)
    }).then(initAll)
  }

  // installJS(name) {
  //   packageJson(name).then(pkg => {
  //
  //   })
  // }
}
