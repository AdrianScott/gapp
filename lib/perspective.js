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

    this.path = GULDHOME;
    process.chdir(this.path);
    this.git = Git(GULDHOME);
    var self = this;
    cfgget().then(function (config) {
      if (config && config.user && config.user.username) {
        self.name = config.user.username;
        self.email = config.user.email;
        self.fingerprint = config.user.signingkey;
        self.loadConfig(self.fingerprint).then(function (config) {
          self.github = github.getGithub({}, config.githubOAUTH);
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
    key: 'init',
    value: function init(username, pass, email, fingerprint) {
      var git;
      gitCfg = {
        'user.username': username,
        'user.email': email,
        'commit.gpgsign': true
      };
      var getFingSafe = function getFingSafe() {
        return new _promise2.default(function (resolve, reject) {
          if (fingerprint) gitCfg['user.signingkey'] = resolve(fingerprint);else {
            gpg.genKey(username, email).then(function () {
              getFingerprint(email).then(resolve);
            }).catch(reject);
          }
        });
      };

      var initAll = function initAll() {
        process.chdir(GULDHOME);
        git = Git(GULDHOME).init();
        return fs.mkdir('life').then(function () {
          fs.mkdir('life/' + username);
        }).then(function () {
          fs.mkdir('media');
        }).then(function () {
          fs.mkdir('tech');
        }).then(function () {
          fs.mkdir('keys');
        }).then(function () {
          fs.mkdir('keys/pgp');
        }).then(function () {
          fs.writeFile('.gitignore', 'node_modules\nconfig.json*');
        }).then(function () {
          git.add('.gitignore');
        }).then(getFingSafe).then(addKey);
      };

      var addKey = function addKey(fingerprint) {
        gitCfg['user.signingkey'] = fingerprint;
        gitconfig.set(gitCfg, { location: 'global' });
        fs.writeFile('life/' + username + '/gap.json', (0, _stringify2.default)({
          "name": username,
          "fingerprint": fingerprint,
          "observer": username
        }, null, 2));
        gpg.gpg.call('', ['--export', '-a', fingerprint], function (err, data) {
          if (err) reject(err);else {
            var keypath = path.join('keys', 'pgp', username + '.asc');
            fs.writeFile(keypath, data.toString('utf-8')).then(function () {
              git.add(keypath);
              github.createGHToken({ username: username, password: pass }).then(function (token) {
                Perspective.saveConfig({ 'githubOAUTH': token }, fingerprint).then(resolve);
              });
            });
          }
        });
      };

      return fs.access(GULDHOME).catch(function (err) {
        fs.mkdir(GULDHOME).then(initAll);
      }).then(initAll);
    }

    // installJS(name) {
    //   packageJson(name).then(pkg => {
    //
    //   })
    // }

  }]);
  return Perspective;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wZXJzcGVjdGl2ZS5qcyJdLCJuYW1lcyI6WyJvcyIsInJlcXVpcmUiLCJmcyIsInBhdGgiLCJnaXRjb25maWciLCJHaXQiLCJnaXRodWIiLCJncGciLCJHVUxESE9NRSIsInByb2Nlc3MiLCJlbnYiLCJqb2luIiwiaG9tZWRpciIsIkNGR1BBVEgiLCJnaXRDZmciLCJjZmdnZXQiLCJyZXNvbHZlIiwicmVqZWN0IiwiZ2V0R2xvYmFsIiwiZ2V0IiwibG9jYXRpb24iLCJ0aGVuIiwiY2F0Y2giLCJjb25maWciLCJ1c2VyIiwic2lnbmluZ2tleSIsImVyciIsIm1vZHVsZSIsImV4cG9ydHMiLCJjaGRpciIsImdpdCIsInNlbGYiLCJ1c2VybmFtZSIsIm5hbWUiLCJlbWFpbCIsImZpbmdlcnByaW50IiwibG9hZENvbmZpZyIsImdldEdpdGh1YiIsImdpdGh1Yk9BVVRIIiwiRXJyb3IiLCJoYXNPd25Qcm9wZXJ0eSIsImRlY3J5cHRGaWxlIiwiY29udGVudHMiLCJlbmNyeXB0IiwiZGF0YSIsIndyaXRlRmlsZSIsInBhc3MiLCJnZXRGaW5nU2FmZSIsImdlbktleSIsImdldEZpbmdlcnByaW50IiwiaW5pdEFsbCIsImluaXQiLCJta2RpciIsImFkZCIsImFkZEtleSIsInNldCIsImNhbGwiLCJrZXlwYXRoIiwidG9TdHJpbmciLCJjcmVhdGVHSFRva2VuIiwicGFzc3dvcmQiLCJ0b2tlbiIsIlBlcnNwZWN0aXZlIiwic2F2ZUNvbmZpZyIsImFjY2VzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxLQUFLQyxRQUFRLElBQVIsQ0FBWDtBQUNBLElBQU1DLEtBQUtELFFBQVEsVUFBUixDQUFYO0FBQ0EsSUFBTUUsT0FBT0YsUUFBUSxNQUFSLENBQWI7QUFDQSxJQUFNRyxZQUFZSCxRQUFRLFdBQVIsQ0FBbEI7QUFDQSxJQUFNSSxNQUFNSixRQUFRLFlBQVIsQ0FBWjtBQUNBLElBQU1LLFNBQVNMLFFBQVEsVUFBUixD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LEdBQVAsRUFBVCxLQUNLO0FBQ0gsZ0JBQUkrQixVQUFVdEQsS0FBS1EsSUFBTCxDQUFVLE1BQVYsRUFBa0IsS0FBbEIsRUFBeUJxQixXQUFXLE1BQXBDLENBQWQ7QUFDQTlCLGVBQUcyQyxTQUFILENBQWFZLE9BQWIsRUFBc0JiLEtBQUtjLFFBQUwsQ0FBYyxPQUFkLENBQXRCLEVBQThDckMsSUFBOUMsQ0FBbUQsWUFBTTtBQUN2RFMsa0JBQUl1QixHQUFKLENBQVFJLE9BQVI7QUFDQW5ELHFCQUFPcUQsYUFBUCxDQUFxQixFQUFDM0IsVUFBVUEsUUFBWCxFQUFxQjRCLFVBQVVkLElBQS9CLEVBQXJCLEVBQ0N6QixJQURELENBQ00sVUFBQ3dDLEtBQUQsRUFBVztBQUNmQyw0QkFBWUMsVUFBWixDQUF1QixFQUFDLGVBQWVGLEtBQWhCLEVBQXZCLEVBQStDMUIsV0FBL0MsRUFBNERkLElBQTVELENBQWlFTCxPQUFqRTtBQUNELGVBSEQ7QUFJRCxhQU5EO0FBT0Q7QUFDRixTQVpEO0FBYUQsT0FyQkQ7O0FBdUJBLGFBQU9kLEdBQUc4RCxNQUFILENBQVV4RCxRQUFWLEVBQ05jLEtBRE0sQ0FDQSxVQUFDSSxHQUFELEVBQVM7QUFDZHhCLFdBQUdrRCxLQUFILENBQVM1QyxRQUFULEVBQW1CYSxJQUFuQixDQUF3QjZCLE9BQXhCO0FBQ0QsT0FITSxFQUdKN0IsSUFISSxDQUdDNkIsT0FIRCxDQUFQO0FBSUQ7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUE5R0Y7QUFBQTtBQUFBIiwiZmlsZSI6InBlcnNwZWN0aXZlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzLWV4dHJhJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IGdpdGNvbmZpZyA9IHJlcXVpcmUoJ2dpdGNvbmZpZycpXG5jb25zdCBHaXQgPSByZXF1aXJlKCdzaW1wbGUtZ2l0JylcbmNvbnN0IGdpdGh1YiA9IHJlcXVpcmUoJy4vZ2l0aHViJylcbmNvbnN0IGdwZyA9IHJlcXVpcmUoJy4vZ3BnJylcbmNvbnN0IEdVTERIT01FID0gcHJvY2Vzcy5lbnYuR1VMREhPTUUgfHwgcGF0aC5qb2luKG9zLmhvbWVkaXIoKSwgJ2Jsb2NrdHJlZScpXG5jb25zdCBDRkdQQVRIID0gcGF0aC5qb2luKEdVTERIT01FLCAnY29uZmlnLmpzb24nKVxudmFyIGdpdENmZ1xuXG52YXIgY2ZnZ2V0ID0gKCkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGZ1bmN0aW9uIGdldEdsb2JhbCAoKSB7XG4gICAgICBnaXRjb25maWcuZ2V0KHtcbiAgICAgICAgbG9jYXRpb246ICdnbG9iYWwnXG4gICAgICB9KS50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdClcbiAgICB9XG4gICAgZ2l0Y29uZmlnLmdldCh7XG4gICAgICBsb2NhdGlvbjogJ2xvY2FsJ1xuICAgIH0pLnRoZW4oKGNvbmZpZykgPT4ge1xuICAgICAgaWYgKGNvbmZpZy51c2VyICYmIGNvbmZpZy51c2VyLnNpZ25pbmdrZXkpIHJlc29sdmUoY29uZmlnKVxuICAgICAgZWxzZSBnZXRHbG9iYWwoKVxuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGdldEdsb2JhbCgpXG4gICAgfSlcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQZXJzcGVjdGl2ZSB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLnBhdGggPSBHVUxESE9NRVxuICAgIHByb2Nlc3MuY2hkaXIodGhpcy5wYXRoKVxuICAgIHRoaXMuZ2l0ID0gR2l0KEdVTERIT01FKVxuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIGNmZ2dldCgpXG4gICAgICAudGhlbigoY29uZmlnKSA9PiB7XG4gICAgICAgIGlmIChjb25maWcgJiYgY29uZmlnLnVzZXIgJiYgY29uZmlnLnVzZXIudXNlcm5hbWUpIHtcbiAgICAgICAgICBzZWxmLm5hbWUgPSBjb25maWcudXNlci51c2VybmFtZVxuICAgICAgICAgIHNlbGYuZW1haWwgPSBjb25maWcudXNlci5lbWFpbFxuICAgICAgICAgIHNlbGYuZmluZ2VycHJpbnQgPSBjb25maWcudXNlci5zaWduaW5na2V5XG4gICAgICAgICAgc2VsZi5sb2FkQ29uZmlnKHNlbGYuZmluZ2VycHJpbnQpLnRoZW4oKGNvbmZpZykgPT4ge1xuICAgICAgICAgICAgc2VsZi5naXRodWIgPSBnaXRodWIuZ2V0R2l0aHViKHt9LCBjb25maWcuZ2l0aHViT0FVVEgpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHRocm93IG5ldyBFcnJvcignTm8gcGVyc3BlY3RpdmUgZm91bmQsIHJ1biBzZXR1cC4nKVxuICAgICAgfSlcbiAgfVxuXG4gIGlzUmVhZHkgKCkge1xuICAgIHJldHVybiB0aGlzLmhhc093blByb3BlcnR5KCdnaXRodWInKVxuICB9XG5cbiAgc3RhdGljIGxvYWRDb25maWcgKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBncGcuZ3BnLmRlY3J5cHRGaWxlKENGR1BBVEgsIGZ1bmN0aW9uKGVyciwgY29udGVudHMpIHtcbiAgICAgICAgaWYgKGVycikgcmVqZWN0KGVycilcbiAgICAgICAgZWxzZSByZXNvbHZlKGNvbnRlbnRzKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgc3RhdGljIHNhdmVDb25maWcgKGNvbmZpZywgZmluZ2VycHJpbnQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZ3BnLmdwZy5lbmNyeXB0KEpTT04uc3RyaW5naWZ5KGNvbmZpZyksIFsnLXInLCBmaW5nZXJwcmludCwgJy0teWVzJywgJy1hJ10sIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICBpZiAoZXJyKSByZWplY3QoZXJyKVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBmcy53cml0ZUZpbGUoQ0ZHUEFUSCwgZGF0YSkudGhlbihyZXNvbHZlKS5jYXRjaChyZWplY3QpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHN0YXRpYyBpbml0ICh1c2VybmFtZSwgcGFzcywgZW1haWwsIGZpbmdlcnByaW50KSB7XG4gICAgdmFyIGdpdFxuICAgIGdpdENmZyA9IHtcbiAgICAgICd1c2VyLnVzZXJuYW1lJzogdXNlcm5hbWUsXG4gICAgICAndXNlci5lbWFpbCc6IGVtYWlsLFxuICAgICAgJ2NvbW1pdC5ncGdzaWduJzogdHJ1ZVxuICAgIH1cbiAgICB2YXIgZ2V0RmluZ1NhZmUgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAoZmluZ2VycHJpbnQpIGdpdENmZ1sndXNlci5zaWduaW5na2V5J10gPSByZXNvbHZlKGZpbmdlcnByaW50KVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBncGcuZ2VuS2V5KHVzZXJuYW1lLCBlbWFpbClcbiAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBnZXRGaW5nZXJwcmludChlbWFpbCkudGhlbihyZXNvbHZlKVxuICAgICAgICAgIH0pLmNhdGNoKHJlamVjdClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB2YXIgaW5pdEFsbCA9ICgpID0+IHtcbiAgICAgIHByb2Nlc3MuY2hkaXIoR1VMREhPTUUpXG4gICAgICBnaXQgPSBHaXQoR1VMREhPTUUpLmluaXQoKVxuICAgICAgcmV0dXJuIGZzLm1rZGlyKCdsaWZlJylcbiAgICAgIC50aGVuKCgpID0+IHtmcy5ta2RpcignbGlmZS8nICsgdXNlcm5hbWUpfSlcbiAgICAgIC50aGVuKCgpID0+IHtmcy5ta2RpcignbWVkaWEnKX0pXG4gICAgICAudGhlbigoKSA9PiB7ZnMubWtkaXIoJ3RlY2gnKX0pXG4gICAgICAudGhlbigoKSA9PiB7ZnMubWtkaXIoJ2tleXMnKX0pXG4gICAgICAudGhlbigoKSA9PiB7ZnMubWtkaXIoJ2tleXMvcGdwJyl9KVxuICAgICAgLnRoZW4oKCkgPT4ge2ZzLndyaXRlRmlsZSgnLmdpdGlnbm9yZScsICdub2RlX21vZHVsZXNcXG5jb25maWcuanNvbionKX0pXG4gICAgICAudGhlbigoKSA9PiB7Z2l0LmFkZCgnLmdpdGlnbm9yZScpfSlcbiAgICAgIC50aGVuKGdldEZpbmdTYWZlKVxuICAgICAgLnRoZW4oYWRkS2V5KVxuICAgIH1cblxuICAgIHZhciBhZGRLZXkgPSAoZmluZ2VycHJpbnQpID0+IHtcbiAgICAgIGdpdENmZ1sndXNlci5zaWduaW5na2V5J10gPSBmaW5nZXJwcmludFxuICAgICAgZ2l0Y29uZmlnLnNldChnaXRDZmcsIHtsb2NhdGlvbjogJ2dsb2JhbCd9KVxuICAgICAgZnMud3JpdGVGaWxlKCdsaWZlLycgKyB1c2VybmFtZSArICcvZ2FwLmpzb24nLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIFwibmFtZVwiOiB1c2VybmFtZSxcbiAgICAgICAgXCJmaW5nZXJwcmludFwiOiBmaW5nZXJwcmludCxcbiAgICAgICAgXCJvYnNlcnZlclwiOiB1c2VybmFtZVxuICAgICAgfSwgbnVsbCwgMikpXG4gICAgICBncGcuZ3BnLmNhbGwoJycsIFsnLS1leHBvcnQnLCAnLWEnLCBmaW5nZXJwcmludF0sIChlcnIsIGRhdGEpID0+IHtcbiAgICAgICAgaWYgKGVycikgcmVqZWN0KGVycilcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFyIGtleXBhdGggPSBwYXRoLmpvaW4oJ2tleXMnLCAncGdwJywgdXNlcm5hbWUgKyAnLmFzYycpXG4gICAgICAgICAgZnMud3JpdGVGaWxlKGtleXBhdGgsIGRhdGEudG9TdHJpbmcoJ3V0Zi04JykpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgZ2l0LmFkZChrZXlwYXRoKVxuICAgICAgICAgICAgZ2l0aHViLmNyZWF0ZUdIVG9rZW4oe3VzZXJuYW1lOiB1c2VybmFtZSwgcGFzc3dvcmQ6IHBhc3N9KVxuICAgICAgICAgICAgLnRoZW4oKHRva2VuKSA9PiB7XG4gICAgICAgICAgICAgIFBlcnNwZWN0aXZlLnNhdmVDb25maWcoeydnaXRodWJPQVVUSCc6IHRva2VufSwgZmluZ2VycHJpbnQpLnRoZW4ocmVzb2x2ZSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gZnMuYWNjZXNzKEdVTERIT01FKVxuICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBmcy5ta2RpcihHVUxESE9NRSkudGhlbihpbml0QWxsKVxuICAgIH0pLnRoZW4oaW5pdEFsbClcbiAgfVxuXG4gIC8vIGluc3RhbGxKUyhuYW1lKSB7XG4gIC8vICAgcGFja2FnZUpzb24obmFtZSkudGhlbihwa2cgPT4ge1xuICAvL1xuICAvLyAgIH0pXG4gIC8vIH1cbn1cbiJdfQ==