const os = require('os')
const path = require('path')
const GitHubApi = require('github')
const gitconfig = require('gitconfig')
const Promise = require('bluebird')
const gpg = require('./gpg.js')
var confPath = path.join(os.homedir(), 'blocktree', 'ghconfig.json')

module.exports.createGHToken = (creds) => {
  return new Promise(function (resolve, reject) {
    var github = module.exports.getGithub()
    github.authenticate({
      type: 'basic',
      username: creds.username,
      password: creds.password
    })
    github.authorization.create({
      // everything, since we want to manage whole lifecycle
      scopes: ['user', 'repo', 'gist', 'admin:org', 'admin:gpg_key', 'admin:public_key', 'admin:org_hook', 'notifications'],
      note: 'guld',
      note_url: 'https://guld.io'
    }, function (err, res) {
      if (err) reject(err)
      if (res && res.data && res.data.token) {
        resolve(res.data.token)
      }
    })
  })
}

module.exports.getGithub = (cfg, token) => {
  cfg = cfg || {}
  cfg.headers = cfg.headers || {'user-agent': 'guld'}
  cfg.protocol = cfg.protocol || 'https'
  cfg.host = cfg.host || 'api.github.com'
  cfg.pathPrefix = cfg.pathPrefix || ''
  cfg.Promise = cfg.Promise || Promise
  cfg.followRedirects = cfg.followRedirects || false
  cfg.timeout = cfg.timeout || 100000
  var github = new GitHubApi(cfg)
  if (token) {
    github.authenticate({
      type: 'oauth',
      token: token
    })
  }
  return github
}
