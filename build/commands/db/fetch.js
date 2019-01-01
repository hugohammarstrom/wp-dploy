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

            _logger.default.info(global.chalk.yellow("dploy: fetching db"));

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
                var local_url, url;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        local_url = String(site.local_url.replace("http://", "").replace("https://", ""));
                        url = String(site.url.replace("http://", "").replace("https://", ""));

                        _logger.default.info(global.chalk.yellow("dploy: setting up site: ".concat(local_url)));

                        setTimeout(function () {
                          return _logger.default.info("dploy: search-replace http://".concat(url));
                        }, 500);

                        _logger.default.info("dploy: search-replace ".concat(url));

                        _context.next = 7;
                        return (0, _exec.default)("".concat(cwd, "/bin/search-replace.sh ").concat(process.cwd(), " ").concat(site.url, " ").concat(local_url), {
                          logging: false
                        });

                      case 7:
                        _logger.default.info("dploy: search-replace https:// to http://");

                        _context.next = 10;
                        return (0, _exec.default)("".concat(cwd, "/bin/search-replace.sh ").concat(process.cwd(), " https://").concat(local_url, " http://").concat(local_url), {
                          logging: false
                        });

                      case 10:
                        if (global.isRoot) {
                          _hostile.default.set("127.0.0.1", local_url, function (err) {
                            if (err) {
                              _logger.default.error("dploy: something went wrong when trying to add ".concat(local_url, " to /etc/hosts"), err);
                            } else {
                              _logger.default.success(global.chalk.yellow("dploy: added ".concat(local_url, " to /etc/hosts")));
                            }
                          });
                        }

                        _logger.default.success(global.chalk.green("dploy: site: ".concat(local_url, " setup")));

                        return _context.abrupt("return", Promise.resolve());

                      case 13:
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
            if (!global.isRoot) {
              _logger.default.warning("dploy: wp-dploy was not executed with root privileges, skipping /etc/host management");
            }

            _logger.default.stop();

            process.exit(0);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _ref.apply(this, arguments);
}