const gpg = require('gpg')

module.exports = {gpg: gpg}

module.exports.listSecretKeys = (term) => {
  return new Promise((resolve, reject) => {
    var keys = {}
    var args = ['--list-secret-keys', '--with-colons']
    if (term) args.push(term)
    gpg.call('', args, (err, data) => {
      if (err) reject(err)
      else {
        var da = data.toString('utf-8').split('\n')
        for (var l in da) {
          if (da[l].startsWith('sec')) {
            var ka = da[l].split(':')
            keys[ka[4].slice(7)] = ka[9]
          }
        }
        resolve(keys)
      }
    })
  })
}

module.exports.getFingerprint = (term) => {
  return new Promise((resolve, reject) => {
    gpg.call('', ['--fingerprint', '--with-colons', term], (err, data) => {
      if (err) reject(err)
      else {
        var da = data.toString('utf-8').split('\n')
        var fa = da[2].split(':')
        resolve(fa[fa.length - 2])
      }
    })
  })
}

module.exports.genKey = (name, email) => {
  var options = `${name} <${email}>`
  return new Promise((resolve, reject) => {
    var opta = ['--batch', '--quick-gen-key', options]
    gpg.call('', opta, (err, data) => {
      if (err) reject(err)
      else resolve()
    })
  })
}
