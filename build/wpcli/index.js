"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _dockerCompose = _interopRequireDefault(require("docker-compose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  this.cli = function (command) {
    return _dockerCompose.default.run("wpcli", "wp " + command, {
      cwd: process.cwd(),
      log: false
    });
  };
}