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
  GULDHOME = GULDHOME

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
          Perspective.loadConfig(self.fingerprint).then((config) => {
            self.github = github.getGithub({}, JSON.parse(config.toString('utf-8')).githubOAUTH)
          })
        } else throw new Error('No perspective found, run setup.')
      })
  }

  isReady () {
    return this.hasOwnProperty('github')
  }

  static loadConfig () {
    return new Promise((resolve, reject) => {
      gpg.gpg.decryptFile(CFGPATH, function (err, contents) {
        if (err) reject(err)
        else resolve(contents)
      })
    })
  }

  static saveConfig (config, fingerprint) {
    return new Promise((resolve, reject) => {
      gpg.gpg.encrypt(JSON.stringify(config), ['-r', fingerprint, '--yes', '-a'], function (err, data) {
        if (err) reject(err)
        else {
          fs.writeFile(CFGPATH, data).then(resolve).catch(reject)
        }
      })
    })
  }

  static startInit (username, pass, email, fingerprint) {
    var git
    gitCfg = {
      'user.username': username,
      'user.email': email,
      'commit.gpgsign': true
    }
    var initDirs = () => {
      process.chdir(GULDHOME)
      git = Git(GULDHOME).init()
      return fs.mkdirs('life/' + username)
      .then(() => { fs.mkdirs('media') })
      .then(() => { fs.mkdirs('tech') })
      .then(() => { fs.mkdirs('keys/pgp') })
      .then(() => { fs.writeFile('.gitignore', 'node_modules\nconfig.json*') })
      .then(() => {
        git.add('./*')
        .submoduleAdd('https://github.com/isysd/vrcave.git', 'tech/js/guld-vrcave')
        .then(Promise.resolve)
      })
    }
    return fs.mkdirs(GULDHOME).then(initDirs)
  }

  static finishInit(username, pass, email, fingerprint) {
    process.chdir(GULDHOME)
    var git = Git(GULDHOME)
    gitCfg = {
      'user.username': username,
      'user.email': email,
      'commit.gpgsign': true
    }
    var getFingSafe = () => {
      return new Promise((resolve, reject) => {
        if (fingerprint) resolve(fingerprint)
        else {
          gpg.genKey(username, email)
          .then(() => {
            getFingerprint(email).then(resolve)
          }).catch(reject)
        }
      })
    }
    var addKey = (fingerprint) => {
      gitCfg['user.signingkey'] = fingerprint
      gitconfig.set(gitCfg, {location: 'global'})
      return fs.writeFile('life/' + username + '/gap.json', JSON.stringify({
          'name': username,
          'fingerprint': fingerprint,
          'observer': username
        }, null, 2))
    }
    return getFingSafe()
    .then(addKey)
    .then(new Promise((resolve, reject) => {
      gpg.gpg.call('', ['--export', '-a', fingerprint], (err, data) => {
        if (err) reject(err)
        else {
          var keypath = path.join('keys', 'pgp', username + '.asc')
          fs.mkdirs(path.join(GULDHOME, 'keys', 'pgp'))
          .then(fs.writeFile(path.join(GULDHOME, keypath), data.toString('utf-8'))).then(() => {
            git.add('./*')
            github.createGHToken({username: username, password: pass})
            .then((token) => {
              Perspective.saveConfig({'githubOAUTH': token}, fingerprint).then(() => {
                var myGH = github.getGithub({}, token)
                myGH.repos.create({
                  'name': username,
                  'description': 'Blocktree perspective of ' + username,
                  'private': false,
                  'has_issues': false,
                  'has_projects': false,
                  'has_wiki': false
                }).then(() => {
                  // TODO use SSH instead of this netrc + OAUTH crap
                  var netrc = require('netrc')
                  var myNetrc = netrc()
                  myNetrc['github.com'] = {'login': username, 'password': token}
                  netrc.save(myNetrc)
                  git.addRemote(username, 'https://github.com/' + username + '/' + username + '.git')
                  .checkoutLocalBranch(username)
                  .commit('Initialize perspective for ' + username)
                  .push(username, username, ['-f']).then(resolve)
                })
              })
            })
          })
        }
      })
    }))
  }

  // installJS(name) {
  //   packageJson(name).then(pkg => {
  //
  //   })
  // }
}
