"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _child_process = require("child_process");

var _logger = _interopRequireDefault(require("./../logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(command) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Promise(function (resolve, reject) {
    var child = (0, _child_process.exec)(command);

    if (config.logging) {
      child.stdout.on('data', function (data) {
        data = data.split("\n");
        data.pop();
        data.join("\n");

        _logger.default.log("".concat(data));
      });
    }

    child.on("exit", function (code) {
      if (code != -1) {
        resolve();
      } else {
        console.log("Something went wrong");
        process.exit(-1);
      }
    });
  });
}