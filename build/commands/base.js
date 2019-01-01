"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _figlet = _interopRequireDefault(require("figlet"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(program) {
  (0, _figlet.default)("wp dploy", function (err, data) {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }

    console.log(global.chalk.blue(data));
    console.log("");
    console.log("");
    program.outputHelp();
    console.log("");
  });
}