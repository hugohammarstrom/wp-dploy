"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ora = _interopRequireDefault(require("ora"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var functions = {
  createSpinner: function createSpinner(message) {
    global.spinner = (0, _ora.default)(global.chalk.green(message || 'dploy')).start();
  },
  stop: function stop() {
    global.spinner.stop();
    global.spinner = undefined;
  },
  success: function success(message) {
    if (global.spinner) {
      global.spinner.text = message;
      global.spinner.succeed();
      global.spinner.text = "";
      global.spinner.start();
      return;
    } else {
      functions.createSpinner();
      functions.succees(message);
    }
  },
  error: function error(message, err) {
    if (global.spinner) {
      global.spinner.text = message;
      global.spinner.fail();
      console.error(err);
      global.spinner.text = "";
      global.spinner.start();
      return;
    } else {
      functions.createSpinner();
      functions.error(message, err);
    }
  },
  warning: function warning(message) {
    if (global.spinner) {
      global.spinner.text = global.chalk.yellow(message);
      global.spinner.stopAndPersist({
        symbol: "⚠"
      });
      global.spinner.text = "";
      global.spinner.start();
      return;
    } else {
      functions.createSpinner();
      functions.warning(message);
    }
  },
  log: function log(message) {
    if (global.spinner) {
      global.spinner.text = message;
      global.spinner.stopAndPersist();
      global.spinner.text = "";
      global.spinner.start();
      return;
    } else {
      functions.createSpinner();
      functions.log(message);
    }
  },
  info: function info(message) {
    if (global.spinner) {
      global.spinner.text = message;
      return;
    } else {
      functions.createSpinner();
      functions.info(message);
    }
  }
};
var _default = functions;
exports.default = _default;