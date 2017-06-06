'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gitconfig = require('gitconfig');

module.exports = {};

module.exports.cfgget = function () {
  return new _promise2.default(function (resolve, reject) {
    function getGlobal() {
      gitconfig.get({
        location: 'global'
      }).then(function (config) {
        resolve(config);
      }).catch(function (err) {
        reject(err);
      });
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

module.exports.setFingerprint = function (term) {
  // self.fingerprint = fingerprint
  // toset['user.signingkey'] = fingerprint
  // toset['commit.gpgsign'] = true
  // resolve(gitconfig.set(toset, {location: 'local'}))
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9naXQuanMiXSwibmFtZXMiOlsiZ2l0Y29uZmlnIiwicmVxdWlyZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJjZmdnZXQiLCJyZXNvbHZlIiwicmVqZWN0IiwiZ2V0R2xvYmFsIiwiZ2V0IiwibG9jYXRpb24iLCJ0aGVuIiwiY29uZmlnIiwiY2F0Y2giLCJlcnIiLCJ1c2VyIiwic2lnbmluZ2tleSIsInNldEZpbmdlcnByaW50IiwidGVybSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFNQSxZQUFZQyxRQUFRLFdBQVIsQ0FBbEI7O0FBRUFDLE9BQU9DLE9BQVAsR0FBaUIsRUFBakI7O0FBRUFELE9BQU9DLE9BQVAsQ0FBZUMsTUFBZixHQUF3QixZQUFNO0FBQzVCLFNBQU8sc0JBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDLGFBQVNDLFNBQVQsR0FBcUI7QUFDbkJQLGdCQUFVUSxHQUFWLENBQWM7QUFDWkMsa0JBQVU7QUFERSxPQUFkLEVBRUdDLElBRkgsQ0FFUSxVQUFDQyxNQUFELEVBQVk7QUFDbEJOLGdCQUFRTSxNQUFSO0FBQ0QsT0FKRCxFQUlHQyxLQUpILENBSVMsVUFBQ0MsR0FBRCxFQUFTO0FBQ2hCUCxlQUFPTyxHQUFQO0FBQ0QsT0FORDtBQU9EO0FBQ0RiLGNBQVVRLEdBQVYsQ0FBYztBQUNaQyxnQkFBVTtBQURFLEtBQWQsRUFFR0MsSUFGSCxDQUVRLFVBQUNDLE1BQUQsRUFBWTtBQUNsQixVQUFJQSxPQUFPRyxJQUFQLElBQWVILE9BQU9HLElBQVAsQ0FBWUMsVUFBL0IsRUFBMkNWLFFBQVFNLE1BQVIsRUFBM0MsS0FDS0o7QUFDTixLQUxELEVBS0dLLEtBTEgsQ0FLUyxVQUFDQyxHQUFELEVBQVM7QUFDaEJOO0FBQ0QsS0FQRDtBQVFELEdBbEJNLENBQVA7QUFtQkQsQ0FwQkQ7O0FBc0JBTCxPQUFPQyxPQUFQLENBQWVhLGNBQWYsR0FBZ0MsVUFBQ0MsSUFBRCxFQUFVO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0QsQ0FMRCIsImZpbGUiOiJnaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBnaXRjb25maWcgPSByZXF1aXJlKCdnaXRjb25maWcnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHt9XG5cbm1vZHVsZS5leHBvcnRzLmNmZ2dldCA9ICgpID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBmdW5jdGlvbiBnZXRHbG9iYWwoKSB7XG4gICAgICBnaXRjb25maWcuZ2V0KHtcbiAgICAgICAgbG9jYXRpb246ICdnbG9iYWwnXG4gICAgICB9KS50aGVuKChjb25maWcpID0+IHtcbiAgICAgICAgcmVzb2x2ZShjb25maWcpXG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIHJlamVjdChlcnIpXG4gICAgICB9KVxuICAgIH1cbiAgICBnaXRjb25maWcuZ2V0KHtcbiAgICAgIGxvY2F0aW9uOiAnbG9jYWwnXG4gICAgfSkudGhlbigoY29uZmlnKSA9PiB7XG4gICAgICBpZiAoY29uZmlnLnVzZXIgJiYgY29uZmlnLnVzZXIuc2lnbmluZ2tleSkgcmVzb2x2ZShjb25maWcpXG4gICAgICBlbHNlIGdldEdsb2JhbCgpXG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgZ2V0R2xvYmFsKClcbiAgICB9KVxuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cy5zZXRGaW5nZXJwcmludCA9ICh0ZXJtKSA9PiB7XG4gIC8vIHNlbGYuZmluZ2VycHJpbnQgPSBmaW5nZXJwcmludFxuICAvLyB0b3NldFsndXNlci5zaWduaW5na2V5J10gPSBmaW5nZXJwcmludFxuICAvLyB0b3NldFsnY29tbWl0LmdwZ3NpZ24nXSA9IHRydWVcbiAgLy8gcmVzb2x2ZShnaXRjb25maWcuc2V0KHRvc2V0LCB7bG9jYXRpb246ICdsb2NhbCd9KSlcbn1cbiJdfQ==