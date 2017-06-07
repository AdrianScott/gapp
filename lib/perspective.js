'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var os = require('os');
var fs = require('fs-extra');
var path = require('path');
var gitconfig = require('gitconfig');
var Git = require('simple-git');
var github = require('./github');
var gpg = require('./gpg');
var GULDHOME = process.env.GULDHOME || path.join(os.homedir(), 'blocktree');
var CFGPATH = path.join(GULDHOME, 'config.json');
var gitCfg;

var cfgget = function cfgget() {
  return new _promise2.default(function (resolve, reject) {
    function getGlobal() {
      gitconfig.get({
        location: 'global'
      }).then(resolve).catch(reject);
    }
    gitconfig.get({
      location: 'local'
    }).then(function (config) {
      if (config.user && config.user.signingkey) resolve(config);else getGlobal();
    }).catch(function (err) {
      getGlobal();
    });
  });
};

module.exports = function () {
  function Perspective() {
    (0, _classCallCheck3.default)(this, Perspective);
    this.GULDHOME = GULDHOME;

    this.path = GULDHOME;
    process.chdir(this.path);
    this.git = Git(GULDHOME);
    var self = this;
    cfgget().then(function (config) {
      if (config && config.user && config.user.username) {
        self.name = config.user.username;
        self.email = config.user.email;
        self.fingerprint = config.user.signingkey;
        Perspective.loadConfig(self.fingerprint).then(function (config) {
          self.github = github.getGithub({}, JSON.parse(config.toString('utf-8')).githubOAUTH);
        });
      } else throw new Error('No perspective found, run setup.');
    });
  }

  (0, _createClass3.default)(Perspective, [{
    key: 'isReady',
    value: function isReady() {
      return this.hasOwnProperty('github');
    }
  }], [{
    key: 'loadConfig',
    value: function loadConfig() {
      return new _promise2.default(function (resolve, reject) {
        gpg.gpg.decryptFile(CFGPATH, function (err, contents) {
          if (err) reject(err);else resolve(contents);
        });
      });
    }
  }, {
    key: 'saveConfig',
    value: function saveConfig(config, fingerprint) {
      return new _promise2.default(function (resolve, reject) {
        gpg.gpg.encrypt((0, _stringify2.default)(config), ['-r', fingerprint, '--yes', '-a'], function (err, data) {
          if (err) reject(err);else {
            fs.writeFile(CFGPATH, data).then(resolve).catch(reject);
          }
        });
      });
    }
  }, {
    key: 'startInit',
    value: function startInit(username, pass, email, fingerprint) {
      var git;
      gitCfg = {
        'user.username': username,
        'user.email': email,
        'commit.gpgsign': true
      };
      var initDirs = function initDirs() {
        process.chdir(GULDHOME);
        git = Git(GULDHOME).init();
        return fs.mkdirs('life/' + username).then(function () {
          fs.mkdirs('media');
        }).then(function () {
          fs.mkdirs('tech');
        }).then(function () {
          fs.mkdirs('keys/pgp');
        }).then(function () {
          fs.writeFile('.gitignore', 'node_modules\nconfig.json*');
        }).then(function () {
          git.add('./*').submoduleAdd('https://github.com/isysd/vrcave.git', 'tech/js/guld-vrcave').then(_promise2.default.resolve);
        });
      };
      return fs.mkdirs(GULDHOME).then(initDirs);
    }
  }, {
    key: 'finishInit',
    value: function finishInit(username, pass, email, fingerprint) {
      process.chdir(GULDHOME);
      var git = Git(GULDHOME);
      gitCfg = {
        'user.username': username,
        'user.email': email,
        'commit.gpgsign': true
      };
      var getFingSafe = function getFingSafe() {
        return new _promise2.default(function (resolve, reject) {
          if (fingerprint) resolve(fingerprint);else {
            gpg.genKey(username, email).then(function () {
              getFingerprint(email).then(resolve);
            }).catch(reject);
          }
        });
      };
      var addKey = function addKey(fingerprint) {
        gitCfg['user.signingkey'] = fingerprint;
        gitconfig.set(gitCfg, { location: 'global' });
        return fs.writeFile('life/' + username + '/gap.json', (0, _stringify2.default)({
          'name': username,
          'fingerprint': fingerprint,
          'observer': username
        }, null, 2));
      };
      return getFingSafe().then(addKey).then(new _promise2.default(function (resolve, reject) {
        gpg.gpg.call('', ['--export', '-a', fingerprint], function (err, data) {
          if (err) reject(err);else {
            var keypath = path.join('keys', 'pgp', username + '.asc');
            fs.mkdirs(path.join(GULDHOME, 'keys', 'pgp')).then(fs.writeFile(path.join(GULDHOME, keypath), data.toString('utf-8'))).then(function () {
              git.add('./*');
              github.createGHToken({ username: username, password: pass }).then(function (token) {
                Perspective.saveConfig({ 'githubOAUTH': token }, fingerprint).then(function () {
                  var myGH = github.getGithub({}, token);
                  myGH.repos.create({
                    'name': username,
                    'description': 'Blocktree perspective of ' + username,
                    'private': false,
                    'has_issues': false,
                    'has_projects': false,
                    'has_wiki': false
                  }).then(function () {
                    // TODO use SSH instead of this netrc + OAUTH crap
                    var netrc = require('netrc');
                    var myNetrc = netrc();
                    myNetrc['github.com'] = { 'login': username, 'password': token };
                    netrc.save(myNetrc);
                    git.addRemote(username, 'https://github.com/' + username + '/' + username + '.git').checkoutLocalBranch(username).commit('Initialize perspective for ' + username).push(username, username, ['-f']).then(resolve);
                  });
                });
              });
            });
          }
        });
      }));
    }

    // installJS(name) {
    //   packageJson(name).then(pkg => {
    //
    //   })
    // }

  }]);
  return Perspective;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wZXJzcGVjdGl2ZS5qcyJdLCJuYW1lcyI6WyJvcyIsInJlcXVpcmUiLCJmcyIsInBhdGgiLCJnaXRjb25maWciLCJHaXQiLCJnaXRodWIiLCJncGciLCJHVUxESE9NRSIsInByb2Nlc3MiLCJlbnYiLCJqb2luIiwiaG9tZWRpciIsIkNGR1BBVEgiLCJnaXRDZmciLCJjZmdnZXQiLCJyZXNvbHZlIiwicmVqZWN0IiwiZ2V0R2xvYmFsIiwiZ2V0IiwibG9jYXRpb24iLCJ0aGVuIiwiY2F0Y2giLCJjb25maWciLCJ1c2VyIiwic2lnbmluZ2tleSIsImVyciIsIm1vZHVsZSIsImV4cG9ydHMiLCJjaGRpciIsImdpdCIsInNlbGYiLCJ1c2VybmFtZSIsIm5hbWUiLCJlbWFpbCIsImZpbmdlcnByaW50IiwiUGVyc3BlY3RpdmUiLCJsb2FkQ29uZmlnIiwiZ2V0R2l0aHViIiwiSlNPTiIsInBhcnNlIiwidG9TdHJpbmciLCJnaXRodWJPQVVUSCIsIkVycm9yIiwiaGFzT3duUHJvcGVydHkiLCJkZWNyeXB0RmlsZSIsImNvbnRlbnRzIiwiZW5jcnlwdCIsImRhdGEiLCJ3cml0ZUZpbGUiLCJwYXNzIiwiaW5pdERpcnMiLCJpbml0IiwibWtkaXJzIiwiYWRkIiwic3VibW9kdWxlQWRkIiwiZ2V0RmluZ1NhZmUiLCJnZW5LZXkiLCJnZXRGaW5nZXJwcmludCIsImFkZEtleSIsInNldCIsImNhbGwiLCJrZXlwYXRoIiwiY3JlYXRlR0hUb2tlbiIsInBhc3N3b3JkIiwidG9rZW4iLCJzYXZlQ29uZmlnIiwibXlHSCIsInJlcG9zIiwiY3JlYXRlIiwibmV0cmMiLCJteU5ldHJjIiwic2F2ZSIsImFkZFJlbW90ZSIsImNoZWNrb3V0TG9jYWxCcmFuY2giLCJjb21taXQiLCJwdXNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQU1BLEtBQUtDLFFBQVEsSUFBUixDQUFYO0FBQ0EsSUFBTUMsS0FBS0QsUUFBUSxVQUFSLENBQVg7QUFD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Q29udGVudCI6WyJjb25zdCBvcyA9IHJlcXVpcmUoJ29zJylcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMtZXh0cmEnKVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgZ2l0Y29uZmlnID0gcmVxdWlyZSgnZ2l0Y29uZmlnJylcbmNvbnN0IEdpdCA9IHJlcXVpcmUoJ3NpbXBsZS1naXQnKVxuY29uc3QgZ2l0aHViID0gcmVxdWlyZSgnLi9naXRodWInKVxuY29uc3QgZ3BnID0gcmVxdWlyZSgnLi9ncGcnKVxuY29uc3QgR1VMREhPTUUgPSBwcm9jZXNzLmVudi5HVUxESE9NRSB8fCBwYXRoLmpvaW4ob3MuaG9tZWRpcigpLCAnYmxvY2t0cmVlJylcbmNvbnN0IENGR1BBVEggPSBwYXRoLmpvaW4oR1VMREhPTUUsICdjb25maWcuanNvbicpXG52YXIgZ2l0Q2ZnXG5cbnZhciBjZmdnZXQgPSAoKSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgZnVuY3Rpb24gZ2V0R2xvYmFsICgpIHtcbiAgICAgIGdpdGNvbmZpZy5nZXQoe1xuICAgICAgICBsb2NhdGlvbjogJ2dsb2JhbCdcbiAgICAgIH0pLnRoZW4ocmVzb2x2ZSkuY2F0Y2gocmVqZWN0KVxuICAgIH1cbiAgICBnaXRjb25maWcuZ2V0KHtcbiAgICAgIGxvY2F0aW9uOiAnbG9jYWwnXG4gICAgfSkudGhlbigoY29uZmlnKSA9PiB7XG4gICAgICBpZiAoY29uZmlnLnVzZXIgJiYgY29uZmlnLnVzZXIuc2lnbmluZ2tleSkgcmVzb2x2ZShjb25maWcpXG4gICAgICBlbHNlIGdldEdsb2JhbCgpXG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgZ2V0R2xvYmFsKClcbiAgICB9KVxuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBlcnNwZWN0aXZlIHtcbiAgR1VMREhPTUUgPSBHVUxESE9NRVxuXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLnBhdGggPSBHVUxESE9NRVxuICAgIHByb2Nlc3MuY2hkaXIodGhpcy5wYXRoKVxuICAgIHRoaXMuZ2l0ID0gR2l0KEdVTERIT01FKVxuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIGNmZ2dldCgpXG4gICAgICAudGhlbigoY29uZmlnKSA9PiB7XG4gICAgICAgIGlmIChjb25maWcgJiYgY29uZmlnLnVzZXIgJiYgY29uZmlnLnVzZXIudXNlcm5hbWUpIHtcbiAgICAgICAgICBzZWxmLm5hbWUgPSBjb25maWcudXNlci51c2VybmFtZVxuICAgICAgICAgIHNlbGYuZW1haWwgPSBjb25maWcudXNlci5lbWFpbFxuICAgICAgICAgIHNlbGYuZmluZ2VycHJpbnQgPSBjb25maWcudXNlci5zaWduaW5na2V5XG4gICAgICAgICAgUGVyc3BlY3RpdmUubG9hZENvbmZpZyhzZWxmLmZpbmdlcnByaW50KS50aGVuKChjb25maWcpID0+IHtcbiAgICAgICAgICAgIHNlbGYuZ2l0aHViID0gZ2l0aHViLmdldEdpdGh1Yih7fSwgSlNPTi5wYXJzZShjb25maWcudG9TdHJpbmcoJ3V0Zi04JykpLmdpdGh1Yk9BVVRIKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ05vIHBlcnNwZWN0aXZlIGZvdW5kLCBydW4gc2V0dXAuJylcbiAgICAgIH0pXG4gIH1cblxuICBpc1JlYWR5ICgpIHtcbiAgICByZXR1cm4gdGhpcy5oYXNPd25Qcm9wZXJ0eSgnZ2l0aHViJylcbiAgfVxuXG4gIHN0YXRpYyBsb2FkQ29uZmlnICgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZ3BnLmdwZy5kZWNyeXB0RmlsZShDRkdQQVRILCBmdW5jdGlvbiAoZXJyLCBjb250ZW50cykge1xuICAgICAgICBpZiAoZXJyKSByZWplY3QoZXJyKVxuICAgICAgICBlbHNlIHJlc29sdmUoY29udGVudHMpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBzdGF0aWMgc2F2ZUNvbmZpZyAoY29uZmlnLCBmaW5nZXJwcmludCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBncGcuZ3BnLmVuY3J5cHQoSlNPTi5zdHJpbmdpZnkoY29uZmlnKSwgWyctcicsIGZpbmdlcnByaW50LCAnLS15ZXMnLCAnLWEnXSwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICBpZiAoZXJyKSByZWplY3QoZXJyKVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBmcy53cml0ZUZpbGUoQ0ZHUEFUSCwgZGF0YSkudGhlbihyZXNvbHZlKS5jYXRjaChyZWplY3QpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHN0YXRpYyBzdGFydEluaXQgKHVzZXJuYW1lLCBwYXNzLCBlbWFpbCwgZmluZ2VycHJpbnQpIHtcbiAgICB2YXIgZ2l0XG4gICAgZ2l0Q2ZnID0ge1xuICAgICAgJ3VzZXIudXNlcm5hbWUnOiB1c2VybmFtZSxcbiAgICAgICd1c2VyLmVtYWlsJzogZW1haWwsXG4gICAgICAnY29tbWl0LmdwZ3NpZ24nOiB0cnVlXG4gICAgfVxuICAgIHZhciBpbml0RGlycyA9ICgpID0+IHtcbiAgICAgIHByb2Nlc3MuY2hkaXIoR1VMREhPTUUpXG4gICAgICBnaXQgPSBHaXQoR1VMREhPTUUpLmluaXQoKVxuICAgICAgcmV0dXJuIGZzLm1rZGlycygnbGlmZS8nICsgdXNlcm5hbWUpXG4gICAgICAudGhlbigoKSA9PiB7IGZzLm1rZGlycygnbWVkaWEnKSB9KVxuICAgICAgLnRoZW4oKCkgPT4geyBmcy5ta2RpcnMoJ3RlY2gnKSB9KVxuICAgICAgLnRoZW4oKCkgPT4geyBmcy5ta2RpcnMoJ2tleXMvcGdwJykgfSlcbiAgICAgIC50aGVuKCgpID0+IHsgZnMud3JpdGVGaWxlKCcuZ2l0aWdub3JlJywgJ25vZGVfbW9kdWxlc1xcbmNvbmZpZy5qc29uKicpIH0pXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIGdpdC5hZGQoJy4vKicpXG4gICAgICAgIC5zdWJtb2R1bGVBZGQoJ2h0dHBzOi8vZ2l0aHViLmNvbS9pc3lzZC92cmNhdmUuZ2l0JywgJ3RlY2gvanMvZ3VsZC12cmNhdmUnKVxuICAgICAgICAudGhlbihQcm9taXNlLnJlc29sdmUpXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gZnMubWtkaXJzKEdVTERIT01FKS50aGVuKGluaXREaXJzKVxuICB9XG5cbiAgc3RhdGljIGZpbmlzaEluaXQodXNlcm5hbWUsIHBhc3MsIGVtYWlsLCBmaW5nZXJwcmludCkge1xuICAgIHByb2Nlc3MuY2hkaXIoR1VMREhPTUUpXG4gICAgdmFyIGdpdCA9IEdpdChHVUxESE9NRSlcbiAgICBnaXRDZmcgPSB7XG4gICAgICAndXNlci51c2VybmFtZSc6IHVzZXJuYW1lLFxuICAgICAgJ3VzZXIuZW1haWwnOiBlbWFpbCxcbiAgICAgICdjb21taXQuZ3Bnc2lnbic6IHRydWVcbiAgICB9XG4gICAgdmFyIGdldEZpbmdTYWZlID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKGZpbmdlcnByaW50KSByZXNvbHZlKGZpbmdlcnByaW50KVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBncGcuZ2VuS2V5KHVzZXJuYW1lLCBlbWFpbClcbiAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBnZXRGaW5nZXJwcmludChlbWFpbCkudGhlbihyZXNvbHZlKVxuICAgICAgICAgIH0pLmNhdGNoKHJlamVjdClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgdmFyIGFkZEtleSA9IChmaW5nZXJwcmludCkgPT4ge1xuICAgICAgZ2l0Q2ZnWyd1c2VyLnNpZ25pbmdrZXknXSA9IGZpbmdlcnByaW50XG4gICAgICBnaXRjb25maWcuc2V0KGdpdENmZywge2xvY2F0aW9uOiAnZ2xvYmFsJ30pXG4gICAgICByZXR1cm4gZnMud3JpdGVGaWxlKCdsaWZlLycgKyB1c2VybmFtZSArICcvZ2FwLmpzb24nLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgJ25hbWUnOiB1c2VybmFtZSxcbiAgICAgICAgICAnZmluZ2VycHJpbnQnOiBmaW5nZXJwcmludCxcbiAgICAgICAgICAnb2JzZXJ2ZXInOiB1c2VybmFtZVxuICAgICAgICB9LCBudWxsLCAyKSlcbiAgICB9XG4gICAgcmV0dXJuIGdldEZpbmdTYWZlKClcbiAgICAudGhlbihhZGRLZXkpXG4gICAgLnRoZW4obmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZ3BnLmdwZy5jYWxsKCcnLCBbJy0tZXhwb3J0JywgJy1hJywgZmluZ2VycHJpbnRdLCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHJlamVjdChlcnIpXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHZhciBrZXlwYXRoID0gcGF0aC5qb2luKCdrZXlzJywgJ3BncCcsIHVzZXJuYW1lICsgJy5hc2MnKVxuICAgICAgICAgIGZzLm1rZGlycyhwYXRoLmpvaW4oR1VMREhPTUUsICdrZXlzJywgJ3BncCcpKVxuICAgICAgICAgIC50aGVuKGZzLndyaXRlRmlsZShwYXRoLmpvaW4oR1VMREhPTUUsIGtleXBhdGgpLCBkYXRhLnRvU3RyaW5nKCd1dGYtOCcpKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBnaXQuYWRkKCcuLyonKVxuICAgICAgICAgICAgZ2l0aHViLmNyZWF0ZUdIVG9rZW4oe3VzZXJuYW1lOiB1c2VybmFtZSwgcGFzc3dvcmQ6IHBhc3N9KVxuICAgICAgICAgICAgLnRoZW4oKHRva2VuKSA9PiB7XG4gICAgICAgICAgICAgIFBlcnNwZWN0aXZlLnNhdmVDb25maWcoeydnaXRodWJPQVVUSCc6IHRva2VufSwgZmluZ2VycHJpbnQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBteUdIID0gZ2l0aHViLmdldEdpdGh1Yih7fSwgdG9rZW4pXG4gICAgICAgICAgICAgICAgbXlHSC5yZXBvcy5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgJ25hbWUnOiB1c2VybmFtZSxcbiAgICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6ICdCbG9ja3RyZWUgcGVyc3BlY3RpdmUgb2YgJyArIHVzZXJuYW1lLFxuICAgICAgICAgICAgICAgICAgJ3ByaXZhdGUnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICdoYXNfaXNzdWVzJzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAnaGFzX3Byb2plY3RzJzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAnaGFzX3dpa2knOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgLy8gVE9ETyB1c2UgU1NIIGluc3RlYWQgb2YgdGhpcyBuZXRyYyArIE9BVVRIIGNyYXBcbiAgICAgICAgICAgICAgICAgIHZhciBuZXRyYyA9IHJlcXVpcmUoJ25ldHJjJylcbiAgICAgICAgICAgICAgICAgIHZhciBteU5ldHJjID0gbmV0cmMoKVxuICAgICAgICAgICAgICAgICAgbXlOZXRyY1snZ2l0aHViLmNvbSddID0geydsb2dpbic6IHVzZXJuYW1lLCAncGFzc3dvcmQnOiB0b2tlbn1cbiAgICAgICAgICAgICAgICAgIG5ldHJjLnNhdmUobXlOZXRyYylcbiAgICAgICAgICAgICAgICAgIGdpdC5hZGRSZW1vdGUodXNlcm5hbWUsICdodHRwczovL2dpdGh1Yi5jb20vJyArIHVzZXJuYW1lICsgJy8nICsgdXNlcm5hbWUgKyAnLmdpdCcpXG4gICAgICAgICAgICAgICAgICAuY2hlY2tvdXRMb2NhbEJyYW5jaCh1c2VybmFtZSlcbiAgICAgICAgICAgICAgICAgIC5jb21taXQoJ0luaXRpYWxpemUgcGVyc3BlY3RpdmUgZm9yICcgKyB1c2VybmFtZSlcbiAgICAgICAgICAgICAgICAgIC5wdXNoKHVzZXJuYW1lLCB1c2VybmFtZSwgWyctZiddKS50aGVuKHJlc29sdmUpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KSlcbiAgfVxuXG4gIC8vIGluc3RhbGxKUyhuYW1lKSB7XG4gIC8vICAgcGFja2FnZUpzb24obmFtZSkudGhlbihwa2cgPT4ge1xuICAvL1xuICAvLyAgIH0pXG4gIC8vIH1cbn1cbiJdfQ==