"use strict";

require("@babel/polyfill");

var _commander = _interopRequireDefault(require("commander"));

var _commands = _interopRequireDefault(require("./commands"));

var _path = _interopRequireDefault(require("path"));

var _config = _interopRequireDefault(require("./handlers/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.chalk = require("chalk");
global.isRoot = require("is-root")();

if (!process.argv.slice(2).length) {
  _commands.default.base(_commander.default);
}

global.initial_cwd = process.cwd();

if (process.env.DEV) {
  process.chdir(_path.default.resolve(process.cwd(), "../test"));
} else {
  process.chdir(process.cwd());
}

if (process.argv.slice(2)[0] !== "init") {
  if (process.argv.slice(2).length) {
    _config.default.loadConfig();
  }
}

_commander.default.command("start").alias("up").description("Start wordpress development environment").action(_commands.default.start);

_commander.default.command("stop").alias("down").description("Stop wordpress development environment").action(_commands.default.stop);

_commander.default.command("init").description("Initialize dploy config").action(_commands.default.init);

_commander.default.command("fetch").alias("db-fetch").description("Fetch database from server and search and replace all configurated sites").action(_commands.default.db.fetch);

_commander.default.parse(process.argv);