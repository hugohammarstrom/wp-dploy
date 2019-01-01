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
  _logger.default.createSpinner("dploy: start local wordpress environment");

  _dockerCompose.default.upAll({
    cwd: _path.default.join(process.cwd()),
    log: false
  }).then(function (res) {
    if (res.err && res.code !== 0) {
      _logger.default.error("Something went wrong:", res.err);

      _logger.default.stop();
    } else {
      _logger.default.success(global.chalk.green('dploy: started local wordpress environment'));

      _logger.default.stop();

      console.log(global.chalk.yellow("dploy: it can take a couple of minutes if this is the first launch"));
    }

    process.exit(0);
  }, function (err) {
    _logger.default.error('Something went wrong:', err.message);

    _logger.default.stop();
  });
}