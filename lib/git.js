'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {};

module.exports.gitcfgget = function () {
  return new _promise2.default(function (resolve, reject) {
    gitconfig.get({
      location: 'local'
    }).then(function (config) {
      resolve(config);
    }).catch(function (err) {
      gitconfig.get({
        location: 'global'
      }).then(function (config) {
        resolve(config);
      }).catch(function (err) {
        reject(err);
      });
    });
  });
};

module.exports.setFingerprint = function (term) {
  return new _promise2.default(function (resolve, reject) {
    gpg.call('', ['--fingerprint', '--with-colons', term], function (err, data) {
      if (err) reject(err);else {
        var da = data.toString('utf-8').split('\n');
        var fa = da[2].split(':');
        resolve(fa[fa.length - 2]
        // self.fingerprint = fingerprint
        // toset['user.signingkey'] = fingerprint
        // toset['commit.gpgsign'] = true
        // resolve(gitconfig.set(toset, {location: 'local'}))
        );
      }
    });
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9naXQuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsImdpdGNmZ2dldCIsInJlc29sdmUiLCJyZWplY3QiLCJnaXRjb25maWciLCJnZXQiLCJsb2NhdGlvbiIsInRoZW4iLCJjb25maWciLCJjYXRjaCIsImVyciIsInNldEZpbmdlcnByaW50IiwidGVybSIsImdwZyIsImNhbGwiLCJkYXRhIiwiZGEiLCJ0b1N0cmluZyIsInNwbGl0IiwiZmEiLCJsZW5ndGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUFBLE9BQU9DLE9BQVAsR0FBaUIsRUFBakI7O0FBRUFELE9BQU9DLE9BQVAsQ0FBZUMsU0FBZixHQUEyQixZQUFNO0FBQy9CLFNBQU8sc0JBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDQyxjQUFVQyxHQUFWLENBQWM7QUFDWkMsZ0JBQVU7QUFERSxLQUFkLEVBRUdDLElBRkgsQ0FFUSxVQUFDQyxNQUFELEVBQVk7QUFDbEJOLGNBQVFNLE1BQVI7QUFDRCxLQUpELEVBSUdDLEtBSkgsQ0FJUyxVQUFDQyxHQUFELEVBQVM7QUFDaEJOLGdCQUFVQyxHQUFWLENBQWM7QUFDWkMsa0JBQVU7QUFERSxPQUFkLEVBRUdDLElBRkgsQ0FFUSxVQUFDQyxNQUFELEVBQVk7QUFDbEJOLGdCQUFRTSxNQUFSO0FBQ0QsT0FKRCxFQUlHQyxLQUpILENBSVMsVUFBQ0MsR0FBRCxFQUFTO0FBQ2hCUCxlQUFPTyxHQUFQO0FBQ0QsT0FORDtBQU9ELEtBWkQ7QUFhRCxHQWRNLENBQVA7QUFlRCxDQWhCRDs7QUFrQkFYLE9BQU9DLE9BQVAsQ0FBZVcsY0FBZixHQUFnQyxVQUFDQyxJQUFELEVBQVU7QUFDeEMsU0FBTyxzQkFBWSxVQUFDVixPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdENVLFFBQUlDLElBQUosQ0FBUyxFQUFULEVBQWEsQ0FBQyxlQUFELEVBQWtCLGVBQWxCLEVBQW1DRixJQUFuQyxDQUFiLEVBQXVELFVBQUNGLEdBQUQsRUFBTUssSUFBTixFQUFlO0FBQ3BFLFVBQUlMLEdBQUosRUFBU1AsT0FBT08sR0FBUCxFQUFULEtBQ0s7QUFDSCxZQUFJTSxLQUFLRCxLQUFLRSxRQUFMLENBQWMsT0FBZCxFQUF1QkMsS0FBdkIsQ0FBNkIsSUFBN0IsQ0FBVDtBQUNBLFlBQUlDLEtBQUtILEdBQUcsQ0FBSCxFQUFNRSxLQUFOLENBQVksR0FBWixDQUFUO0FBQ0FoQixnQkFBUWlCLEdBQUdBLEdBQUdDLE1BQUgsR0FBWSxDQUFmO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQUtEO0FBQ0YsS0FYRDtBQVlELEdBYk0sQ0FBUDtBQWNELENBZkQiLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7fVxuXG5tb2R1bGUuZXhwb3J0cy5naXRjZmdnZXQgPSAoKSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgZ2l0Y29uZmlnLmdldCh7XG4gICAgICBsb2NhdGlvbjogJ2xvY2FsJ1xuICAgIH0pLnRoZW4oKGNvbmZpZykgPT4ge1xuICAgICAgcmVzb2x2ZShjb25maWcpXG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgZ2l0Y29uZmlnLmdldCh7XG4gICAgICAgIGxvY2F0aW9uOiAnZ2xvYmFsJ1xuICAgICAgfSkudGhlbigoY29uZmlnKSA9PiB7XG4gICAgICAgIHJlc29sdmUoY29uZmlnKVxuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICByZWplY3QoZXJyKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cy5zZXRGaW5nZXJwcmludCA9ICh0ZXJtKSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgZ3BnLmNhbGwoJycsIFsnLS1maW5nZXJwcmludCcsICctLXdpdGgtY29sb25zJywgdGVybV0sIChlcnIsIGRhdGEpID0+IHtcbiAgICAgIGlmIChlcnIpIHJlamVjdChlcnIpXG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFyIGRhID0gZGF0YS50b1N0cmluZygndXRmLTgnKS5zcGxpdCgnXFxuJylcbiAgICAgICAgdmFyIGZhID0gZGFbMl0uc3BsaXQoJzonKVxuICAgICAgICByZXNvbHZlKGZhW2ZhLmxlbmd0aCAtIDJdKVxuICAgICAgICAvLyBzZWxmLmZpbmdlcnByaW50ID0gZmluZ2VycHJpbnRcbiAgICAgICAgLy8gdG9zZXRbJ3VzZXIuc2lnbmluZ2tleSddID0gZmluZ2VycHJpbnRcbiAgICAgICAgLy8gdG9zZXRbJ2NvbW1pdC5ncGdzaWduJ10gPSB0cnVlXG4gICAgICAgIC8vIHJlc29sdmUoZ2l0Y29uZmlnLnNldCh0b3NldCwge2xvY2F0aW9uOiAnbG9jYWwnfSkpXG4gICAgICB9XG4gICAgfSlcbiAgfSlcbn1cbiJdfQ==