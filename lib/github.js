'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GitHubApi = require('github');
var Promise = require('bluebird');
var ghconfig;

module.exports.github = new GitHubApi({
  protocol: 'https',
  host: 'api.github.com',
  pathPrefix: '',
  headers: {
    'user-agent': 'guld'
  },
  Promise: Promise,
  followRedirects: false,
  timeout: 5000
});

module.exports.createGHToken = function (creds) {
  return new Promise(function (resolve, reject) {
    module.exports.github.authenticate({
      type: 'basic',
      username: creds.username,
      password: creds.pass
    });
    module.exports.github.authorization.create({
      // everything, since we want to manage whole lifecycle
      scopes: ['user', 'repo', 'gist', 'admin', 'notifications'],
      note: 'guld',
      note_url: 'https://guld.io'
    }, function (err, res) {
      if (err) reject(err);
      if (res && res.data && res.data.token) {
        ghconfig = { 'token': res.data.token };
        gitconfig.set({
          'user.username': creds.username
        }, {
          location: 'global'
        }).then(function () {
          fs.writeFile(confPath, (0, _stringify2.default)(ghconfig)).then(resolve()).catch(function (err) {
            reject(err);
          });
        });
      }
    });
  });
};

module.exports.loadGHConf = function () {
  return new Promise(function (resolve, reject) {
    fs.readFile(confPath).then(function (lines) {
      ghconfig = JSON.parse(lines.toString('utf-8'));
      if (ghconfig && config.ghtoken) {
        module.exports.github.authenticate({
          type: 'oauth',
          token: config.ghtoken
        });
        resolve();
      } else {
        reject("No github configuration found");
      }
    }).catch(function (err) {
      askGHLogin().then(createGHToken);
    });
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9naXRodWIuanMiXSwibmFtZXMiOlsiR2l0SHViQXBpIiwicmVxdWlyZSIsIlByb21pc2UiLCJnaGNvbmZpZyIsIm1vZHVsZSIsImV4cG9ydHMiLCJnaXRodWIiLCJwcm90b2NvbCIsImhvc3QiLCJwYXRoUHJlZml4IiwiaGVhZGVycyIsImZvbGxvd1JlZGlyZWN0cyIsInRpbWVvdXQiLCJjcmVhdGVHSFRva2VuIiwiY3JlZHMiLCJyZXNvbHZlIiwicmVqZWN0IiwiYXV0aGVudGljYXRlIiwidHlwZSIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJwYXNzIiwiYXV0aG9yaXphdGlvbiIsImNyZWF0ZSIsInNjb3BlcyIsIm5vdGUiLCJub3RlX3VybCIsImVyciIsInJlcyIsImRhdGEiLCJ0b2tlbiIsImdpdGNvbmZpZyIsInNldCIsImxvY2F0aW9uIiwidGhlbiIsImZzIiwid3JpdGVGaWxlIiwiY29uZlBhdGgiLCJjYXRjaCIsImxvYWRHSENvbmYiLCJyZWFkRmlsZSIsImxpbmVzIiwiSlNPTiIsInBhcnNlIiwidG9TdHJpbmciLCJjb25maWciLCJnaHRva2VuIiwiYXNrR0hMb2dpbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFNQSxZQUFZQyxRQUFRLFFBQVIsQ0FBbEI7QUFDQSxJQUFNQyxVQUFVRCxRQUFRLFVBQVIsQ0FBaEI7QUFDQSxJQUFJRSxRQUFKOztBQUVBQyxPQUFPQyxPQUFQLENBQWVDLE1BQWYsR0FBd0IsSUFBSU4sU0FBSixDQUFjO0FBQ3BDTyxZQUFVLE9BRDBCO0FBRXBDQyxRQUFNLGdCQUY4QjtBQUdwQ0MsY0FBWSxFQUh3QjtBQUlwQ0MsV0FBUztBQUNQLGtCQUFjO0FBRFAsR0FKMkI7QUFPcENSLFdBQVNBLE9BUDJCO0FBUXBDUyxtQkFBaUIsS0FSbUI7QUFTcENDLFdBQVM7QUFUMkIsQ0FBZCxDQUF4Qjs7QUFZQVIsT0FBT0MsT0FBUCxDQUFlUSxhQUFmLEdBQStCLFVBQUNDLEtBQUQsRUFBVztBQUN4QyxTQUFPLElBQUlaLE9BQUosQ0FBWSxVQUFVYSxPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUM1Q1osV0FBT0MsT0FBUCxDQUFlQyxNQUFmLENBQXNCVyxZQUF0QixDQUFtQztBQUNqQ0MsWUFBTSxPQUQyQjtBQUVqQ0MsZ0JBQVVMLE1BQU1LLFFBRmlCO0FBR2pDQyxnQkFBVU4sTUFBTU87QUFIaUIsS0FBbkM7QUFLQWpCLFdBQU9DLE9BQVAsQ0FBZUMsTUFBZixDQUFzQmdCLGFBQXRCLENBQW9DQyxNQUFwQyxDQUEyQztBQUN6QztBQUNBQyxjQUFRLENBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsTUFBakIsRUFBeUIsT0FBekIsRUFBa0MsZUFBbEMsQ0FGaUM7QUFHekNDLFlBQU0sTUFIbUM7QUFJekNDLGdCQUFVO0FBSitCLEtBQTNDLEVBS0csVUFBVUMsR0FBVixFQUFlQyxHQUFmLEVBQW9CO0FBQ3JCLFVBQUlELEdBQUosRUFBU1gsT0FBT1csR0FBUDtBQUNULFVBQUlDLE9BQU9BLElBQUlDLElBQVgsSUFBbUJELElBQUlDLElBQUosQ0FBU0MsS0FBaEMsRUFBdUM7QUFDckMzQixtQkFBVyxFQUFDLFNBQVN5QixJQUFJQyxJQUFKLENBQVNDLEtBQW5CLEVBQVg7QUFDQUMsa0JBQVVDLEdBQVYsQ0FBYztBQUNaLDJCQUFpQmxCLE1BQU1LO0FBRFgsU0FBZCxFQUVHO0FBQ0RjLG9CQUFVO0FBRFQsU0FGSCxFQUlHQyxJQUpILENBSVEsWUFBTTtBQUNaQyxhQUFHQyxTQUFILENBQWFDLFFBQWIsRUFBdUIseUJBQWVsQyxRQUFmLENBQXZCLEVBQ0crQixJQURILENBQ1FuQixTQURSLEVBRUd1QixLQUZILENBRVMsVUFBQ1gsR0FBRCxFQUFTO0FBQ2RYLG1CQUFPVyxHQUFQO0FBQ0QsV0FKSDtBQUtELFNBVkQ7QUFXRDtBQUNGLEtBckJEO0FBc0JELEdBNUJNLENBQVA7QUE2QkQsQ0E5QkQ7O0FBa0NBdkIsT0FBT0MsT0FBUCxDQUFla0MsVUFBZixHQUE0QixZQUFNO0FBQ2hDLFNBQU8sSUFBSXJDLE9BQUosQ0FBWSxVQUFVYSxPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUM1Q21CLE9BQUdLLFFBQUgsQ0FBWUgsUUFBWixFQUFzQkgsSUFBdEIsQ0FBMkIsVUFBQ08sS0FBRCxFQUFXO0FBQ3BDdEMsaUJBQVd1QyxLQUFLQyxLQUFMLENBQVdGLE1BQU1HLFFBQU4sQ0FBZSxPQUFmLENBQVgsQ0FBWDtBQUNBLFVBQUl6QyxZQUFZMEMsT0FBT0MsT0FBdkIsRUFBZ0M7QUFDOUIxQyxlQUFPQyxPQUFQLENBQWVDLE1BQWYsQ0FBc0JXLFlBQXRCLENBQW1DO0FBQ2pDQyxnQkFBTSxPQUQyQjtBQUVqQ1ksaUJBQU9lLE9BQU9DO0FBRm1CLFNBQW5DO0FBSUEvQjtBQUNELE9BTkQsTUFNTztBQUNMQyxlQUFPLCtCQUFQO0FBQ0Q7QUFDRixLQVhELEVBV0dzQixLQVhILENBV1MsVUFBQ1gsR0FBRCxFQUFTO0FBQ2hCb0IsbUJBQ0diLElBREgsQ0FDUXJCLGFBRFI7QUFFRCxLQWREO0FBZUQsR0FoQk0sQ0FBUDtBQWlCRCxDQWxCRCIsImZpbGUiOiJnaXRodWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBHaXRIdWJBcGkgPSByZXF1aXJlKCdnaXRodWInKVxuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJylcbnZhciBnaGNvbmZpZ1xuXG5tb2R1bGUuZXhwb3J0cy5naXRodWIgPSBuZXcgR2l0SHViQXBpKHtcbiAgcHJvdG9jb2w6ICdodHRwcycsXG4gIGhvc3Q6ICdhcGkuZ2l0aHViLmNvbScsXG4gIHBhdGhQcmVmaXg6ICcnLFxuICBoZWFkZXJzOiB7XG4gICAgJ3VzZXItYWdlbnQnOiAnZ3VsZCdcbiAgfSxcbiAgUHJvbWlzZTogUHJvbWlzZSxcbiAgZm9sbG93UmVkaXJlY3RzOiBmYWxzZSxcbiAgdGltZW91dDogNTAwMFxufSlcblxubW9kdWxlLmV4cG9ydHMuY3JlYXRlR0hUb2tlbiA9IChjcmVkcykgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIG1vZHVsZS5leHBvcnRzLmdpdGh1Yi5hdXRoZW50aWNhdGUoe1xuICAgICAgdHlwZTogJ2Jhc2ljJyxcbiAgICAgIHVzZXJuYW1lOiBjcmVkcy51c2VybmFtZSxcbiAgICAgIHBhc3N3b3JkOiBjcmVkcy5wYXNzXG4gICAgfSlcbiAgICBtb2R1bGUuZXhwb3J0cy5naXRodWIuYXV0aG9yaXphdGlvbi5jcmVhdGUoe1xuICAgICAgLy8gZXZlcnl0aGluZywgc2luY2Ugd2Ugd2FudCB0byBtYW5hZ2Ugd2hvbGUgbGlmZWN5Y2xlXG4gICAgICBzY29wZXM6IFsndXNlcicsICdyZXBvJywgJ2dpc3QnLCAnYWRtaW4nLCAnbm90aWZpY2F0aW9ucyddLFxuICAgICAgbm90ZTogJ2d1bGQnLFxuICAgICAgbm90ZV91cmw6ICdodHRwczovL2d1bGQuaW8nXG4gICAgfSwgZnVuY3Rpb24gKGVyciwgcmVzKSB7XG4gICAgICBpZiAoZXJyKSByZWplY3QoZXJyKVxuICAgICAgaWYgKHJlcyAmJiByZXMuZGF0YSAmJiByZXMuZGF0YS50b2tlbikge1xuICAgICAgICBnaGNvbmZpZyA9IHsndG9rZW4nOiByZXMuZGF0YS50b2tlbn1cbiAgICAgICAgZ2l0Y29uZmlnLnNldCh7XG4gICAgICAgICAgJ3VzZXIudXNlcm5hbWUnOiBjcmVkcy51c2VybmFtZVxuICAgICAgICB9LCB7XG4gICAgICAgICAgbG9jYXRpb246ICdnbG9iYWwnXG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGZzLndyaXRlRmlsZShjb25mUGF0aCwgSlNPTi5zdHJpbmdpZnkoZ2hjb25maWcpKVxuICAgICAgICAgICAgLnRoZW4ocmVzb2x2ZSgpKVxuICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfSlcbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzLmxvYWRHSENvbmYgPSAoKSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZnMucmVhZEZpbGUoY29uZlBhdGgpLnRoZW4oKGxpbmVzKSA9PiB7XG4gICAgICBnaGNvbmZpZyA9IEpTT04ucGFyc2UobGluZXMudG9TdHJpbmcoJ3V0Zi04JykpXG4gICAgICBpZiAoZ2hjb25maWcgJiYgY29uZmlnLmdodG9rZW4pIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMuZ2l0aHViLmF1dGhlbnRpY2F0ZSh7XG4gICAgICAgICAgdHlwZTogJ29hdXRoJyxcbiAgICAgICAgICB0b2tlbjogY29uZmlnLmdodG9rZW5cbiAgICAgICAgfSlcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWplY3QoXCJObyBnaXRodWIgY29uZmlndXJhdGlvbiBmb3VuZFwiKVxuICAgICAgfVxuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGFza0dITG9naW4oKVxuICAgICAgICAudGhlbihjcmVhdGVHSFRva2VuKVxuICAgIH0pXG4gIH0pXG59XG4iXX0=