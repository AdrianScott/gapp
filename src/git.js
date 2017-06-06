const gitconfig = require('gitconfig')

module.exports = {}

module.exports.cfgget = () => {
  return new Promise((resolve, reject) => {
    function getGlobal() {
      gitconfig.get({
        location: 'global'
      }).then((config) => {
        resolve(config)
      }).catch((err) => {
        reject(err)
      })
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

module.exports.setFingerprint = (term) => {
  // self.fingerprint = fingerprint
  // toset['user.signingkey'] = fingerprint
  // toset['commit.gpgsign'] = true
  // resolve(gitconfig.set(toset, {location: 'local'}))
}
