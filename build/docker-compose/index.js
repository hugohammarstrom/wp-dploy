'use strict';

var childProcess = require('child_process');
/**
 * Converts supplied yml files to cli arguments
 * https://docs.docker.com/compose/reference/overview/#use--f-to-specify-name-and-path-of-one-or-more-compose-files
 * @param {?(string|string[])} config
 */


var configToArgs = function configToArgs(config) {
  if (typeof config === 'undefined') {
    return [];
  } else if (typeof config === 'string') {
    return ['-f', config];
  } else if (config instanceof Array) {
    return config.reduce(function (args, item) {
      return args.concat(['-f', item]);
    }, []);
  }

  throw new Error("Invalid argument supplied: ".concat(config));
};
/**
 * Executes docker-compose command with common options
 * @param {string} command
 * @param {string[]} args
 * @param {object} options
 * @param {string} options.cwd
 * @param {boolean} [options.log]
 * @param {?(string|string[])} [options.config]
 * @param {?object} [options.env]
 */


var execCompose = function execCompose(command, args, options) {
  return new Promise(function (resolve, reject) {
    var composeArgs = configToArgs(options.config).concat([command], args);
    var cwd = options.cwd;
    var env = options.env || null;
    var childProc = childProcess.spawn('docker-compose', composeArgs, {
      cwd: cwd,
      env: env
    });
    childProc.on('error', function (err) {
      reject(err);
    });
    var result = {
      err: '',
      out: '',
      code: 0
    };
    childProc.stdout.on('data', function (chunk) {
      result.out += chunk.toString();
    });
    childProc.stderr.on('data', function (chunk) {
      result.err += chunk.toString();
    });
    childProc.on("exit", function (code) {
      result.code = code;
      resolve(result);
    });

    if (options.log) {
      childProc.stdout.pipe(process.stdout);
      childProc.stderr.pipe(process.stderr);
    }
  });
};
/**
 * @param {object} options
 * @param {string} options.cwd
 * @param {boolean} [options.log]
 * @param {?(string|string[])} [options.config]
 * @param {?object} [options.env]
 */


var upAll = function upAll(options) {
  return execCompose('up', ['-d'], options);
};
/**
 * @param {string[]} services
 * @param {object} options
 * @param {string} options.cwd
 * @param {boolean} [options.log]
 * @param {?(string|string[])} [options.config]
 * @param {?object} [options.env]
 */


var upMany = function upMany(services, options) {
  return execCompose('up', ['-d'].concat(services), options);
};
/**
 * @param {string} service
 * @param {object} options
 * @param {string} options.cwd
 * @param {boolean} [options.log]
 * @param {?(string|string[])} [options.config]
 * @param {?object} [options.env]
 */


var upOne = function upOne(service, options) {
  return execCompose('up', ['-d', service], options);
};
/**
 * @param {object} options
 * @param {string} options.cwd
 * @param {boolean} [options.log]
 * @param {?(string|string[])} [options.config]
 * @param {?object} [options.env]
 */


var down = function down(options) {
  return execCompose('down', [], options);
};
/**
 * @param {object} options
 * @param {string} options.cwd
 * @param {boolean} [options.log]
 * @param {?(string|string[])} [options.config]
 * @param {?object} [options.env]
 */


var stop = function stop(options) {
  return execCompose('stop', [], options);
};
/**
 * @param {object} options
 * @param {string} options.cwd
 * @param {boolean} [options.log]
 * @param {?(string|string[])} [options.config]
 * @param {?object} [options.env]
 */


var kill = function kill(options) {
  return execCompose('kill', [], options);
};
/**
 * @param {object} options
 * @param {string} options.cwd
 * @param {boolean} [options.log]
 * @param {?(string|string[])} [options.config]
 * @param {?object} [options.env]
 */


var rm = function rm(options) {
  return execCompose('rm', ['-f'], options);
};
/**
 * Execute command in a running container
 * @param {string} contaier container name
 * @param {string} command command to execute
 * @param {object} options
 * @param {string} options.cwd
 * @param {boolean} [options.log]
 * @param {?(string|string[])} [options.config]
 * @param {?object} [options.env]
 *
 * @return {object} std.out / std.err
 */


var exec = function exec(container, command, options) {
  var args = command.split(/\s+/);
  return execCompose('exec', ['-T', container].concat(args), options);
};
/**
 * Run command
 * @param {string} contaier container name
 * @param {string} command command to execute
 * @param {object} options
 * @param {string} options.cwd
 * @param {boolean} [options.log]
 * @param {?(string|string[])} [options.config]
 * @param {?object} [options.env]
 *
 * @return {object} std.out / std.err
 */


var run = function run(container, command, options) {
  var args = command.split(/\s+/);
  return execCompose('run', ['-T', container].concat(args), options);
};
/**
 * Build command
 * @param {object} options
 * @param {string} options.cwd
 * @param {boolean} [options.log]
 * @param {?(string|string[])} [options.config]
 * @param {?object} [options.env]
 *
 * @return {object} std.out / std.err
 */


var buildAll = function buildAll(options) {
  return execCompose('build', [], options);
};
/**
 * Build command
 * @param {string[]} services list of service names
 * @param {object} options
 * @param {string} options.cwd
 * @param {boolean} [options.log]
 * @param {?(string|string[])} [options.config]
 * @param {?object} [options.env]
 *
 * @return {object} std.out / std.err
 */


var buildMany = function buildMany(services, options) {
  return execCompose('build', services, options);
};
/**
 * Build command
 * @param {string} service service name
 * @param {object} options
 * @param {string} options.cwd
 * @param {boolean} [options.log]
 * @param {?(string|string[])} [options.config]
 * @param {?object} [options.env]
 *
 * @return {object} std.out / std.err
 */


var buildOne = function buildOne(service, options) {
  return execCompose('build', [service], options);
};

module.exports = {
  upAll: upAll,
  upMany: upMany,
  upOne: upOne,
  kill: kill,
  down: down,
  stop: stop,
  rm: rm,
  exec: exec,
  run: run,
  buildAll: buildAll,
  buildMany: buildMany,
  buildOne: buildOne
};