"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _fs = _interopRequireDefault(require("fs"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _path = _interopRequireDefault(require("path"));

var _appRootPath = _interopRequireDefault(require("app-root-path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var cwd = _appRootPath.default.toString();

  if (_fs.default.existsSync(_path.default.resolve(process.cwd(), "./.dployrc.json"))) {
    console.log(global.chalk.yellow("dploy: dploy already initialized"));
    return;
  }

  _inquirer.default.prompt([{
    type: "confirm",
    message: "Use wizard:",
    name: "use_wizard"
  },
  /*{
      type: "confirm",
      message: "Use docker-compose file:",
      name: "use_dockerfile",
      when: (res) => res.use_wizard,
  },*/
  {
    message: "Host:",
    name: "host",
    when: function when(res) {
      return res.use_wizard;
    }
  }, {
    message: "Username:",
    name: "username",
    when: function when(res) {
      return res.use_wizard;
    }
  }, {
    message: "Wordpress installation path on server:",
    name: "install_path",
    when: function when(res) {
      return res.use_wizard;
    }
  }, {
    message: "Siteurl:",
    name: "siteurl",
    when: function when(res) {
      return res.use_wizard;
    }
  }, {
    message: "Local siteurl:",
    name: "local_siteurl",
    when: function when(res) {
      return res.use_wizard;
    }
  }]).then(function (res) {
    var json = {
      "useDockerfile": true,
      "server": {
        "host": "example.com",
        "username": "root",
        "installation": {
          "path": "/home/ubuntu/wp-installation"
        }
      },
      "sites": [{
        "url": "http://example.com",
        "local_url": "http://example.localhost"
      }]
    };

    if (res.use_wizard) {
      //json.useDockerfile = res.use_dockerfile
      json.server.host = res.host;
      json.server.username = res.username;
      json.server.installation.path = res.install_path;
      json.sites[0].url = res.siteurl;
      json.sites[0].local_url = res.local_siteurl;
    }

    if (json.useDockerfile) {
      _fs.default.copyFileSync("".concat(cwd, "/templates/docker-compose.yml"), _path.default.resolve(process.cwd(), "./docker-compose.yml"));
    }

    _fs.default.writeFileSync(_path.default.resolve(process.cwd(), "./.dployrc.json"), JSON.stringify(json, null, 4));
  });
} // {
//     "server": {
//         "host": "torresta-alpha.tk",
//         "username": "ubuntu",
//         "installation": {
//             "path": "/home/ubuntu/wp-docker/wp"
//         }
//     },
//     "sites": [{
//         "url": "http://alpha.local:8000",
//         "local_url": "http://wordpress.localhost"
//     }]
// }