import "@babel/polyfill";

import program from "commander"
import commands from "./commands"
import path from "path"
import configHandler from "./handlers/config"

global.chalk = require("chalk")
global.isRoot = require("is-root")()

if (!process.argv.slice(2).length) {
    commands.base(program)
}

global.initial_cwd = process.cwd()

if (process.env.DEV){
    process.chdir(path.resolve(process.cwd(), "../test"))
} else {
    process.chdir(process.cwd())
}

if (process.argv.slice(2)[0] !== "init"){
    if (process.argv.slice(2).length) {
        configHandler.loadConfig()
    }
}

program
    .command("start")
    .alias("up")
    .description("Start wordpress development environment")
    .action(commands.start)

program
    .command("stop")
    .alias("down")
    .description("Stop wordpress development environment")
    .action(commands.stop)

program
    .command("init")
    .description("Initialize dploy config")
    .action(commands.init)

program
    .command("fetch")
    .alias("db-fetch")
    .description("Fetch database from server and search and replace all configurated sites")
    .action(commands.db.fetch)

program.parse(process.argv)
