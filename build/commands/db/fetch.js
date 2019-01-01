"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _exec = _interopRequireDefault(require("./../../exec"));

var _hostile = _interopRequireDefault(require("hostile"));

var _logger = _interopRequireDefault(require("./../../logger"));

var _path = _interopRequireDefault(require("path"));

var _appRootPath = _interopRequireDefault(require("app-root-path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _default() {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var cwd, _global, config;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            cwd = _appRootPath.default.toString();
            _global = global, config = _global.config;

            _logger.default.log(global.chalk.green("dploy: started db fetch"));

            _logger.default.log(global.chalk.yellow("dploy: fetching db"));

            _context2.next = 6;
            return (0, _exec.default)("".concat(cwd, "/bin/fetch-db.sh ").concat(process.cwd(), " ").concat(config.server.installation.path, " ").concat(config.server.username, "@").concat(config.server.host), {
              logging: true
            });

          case 6:
            _logger.default.success(global.chalk.green("dploy: fetched db"));

            _context2.next = 9;
            return Promise.all(config.sites.map(
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee(site) {
                var localUrl;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        localUrl = String(site.local_url.replace("http://", "").replace("https://", ""));

                        _logger.default.log(global.chalk.yellow("dploy: setting up site: ".concat(localUrl)));

                        _context.next = 4;
                        return (0, _exec.default)("".concat(cwd, "/bin/search-replace.sh ").concat(process.cwd(), " ").concat(site.url, " ").concat(site.local_url), {
                          logging: false
                        });

                      case 4:
                        _hostile.default.set("127.0.0.1", localUrl, function (err) {
                          if (err) {
                            _logger.default.error("dploy: something went wrong when trying to add ".concat(localUrl, " to /etc/hosts"), err);
                          } else {
                            _logger.default.success(global.chalk.yellow("dploy: added ".concat(localUrl, " to /etc/hosts")));
                          }
                        });

                        _logger.default.success(global.chalk.green("dploy: site: ".concat(localUrl, " setup")));

                        return _context.abrupt("return", Promise.resolve());

                      case 7:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));

              return function (_x) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 9:
            _logger.default.stop();

            process.exit(0);

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _ref.apply(this, arguments);
}