"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _dockerCompose = _interopRequireDefault(require("../docker-compose"));

var _path = _interopRequireDefault(require("path"));

var _logger = _interopRequireDefault(require("./../logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(a, b) {
  _logger.default.createSpinner("dploy: stopping local wordpress environment");

  _dockerCompose.default.down({
    cwd: _path.default.join(process.cwd()),
    log: false
  }).then(function (res) {
    if (res.err && res.code !== 0) {
      _logger.default.error("Something went wrong:", res.err);
    } else {
      _logger.default.success(global.chalk.green('dploy: stopped local wordpress environment'));
    }

    _logger.default.stop();

    process.exit(0);
  }, function (err) {
    console.log('something went wrong:', err.message);
  });
}