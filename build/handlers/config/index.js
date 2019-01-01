"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  loadConfig: function loadConfig() {
    var config;

    try {
      config = _fs.default.readFileSync(_path.default.resolve(process.cwd(), "./.dployrc.json"), {
        encoding: "UTF8"
      });
    } catch (error) {
      console.log(global.chalk.red("dploy: .dployrc.json file not found, run:"), global.chalk.white("\"wp-dploy init\""));
    }

    try {
      global.config = JSON.parse(config);
    } catch (error) {
      console.log(global.chalk.red("dploy: .dployrc.json file not correct"));
      global.config = {};
    }
  }
};
exports.default = _default;