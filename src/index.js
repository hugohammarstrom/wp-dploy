import "@babel/polyfill";

import program from "commander"
import commands from "./commands"
import path from "path"
import versionHandler from "./handlers/version"
import logger from "./logger"
import config from "./handlers/config"

global.chalk = require("chalk")
global.isRoot = require("is-root")();


(async () => {


    let lastCheck = await config.global.get("update.lastCheck", 0)
    if (Date.now() - lastCheck > 86400 * 1000){
        logger.info("wp-dploy: checking for updates")
        let latest = await versionHandler.hasUpdate()
        if (latest){
            logger.warning(`wp-dploy: wp-dploy is out of date, latest version is ${latest.version} and you have ${latest.current}. Run "npm update @hugohammarstrom/wp-dploy" to update`)
        } else {
            logger.success(`wp-dploy: is up to date`)
        }
        await config.global.set("update.lastCheck", Date.now())
        logger.stop()
    }


    if (!process.argv.slice(2).length) {
        commands.base(program)
    }
    
    global.initial_cwd = process.cwd()
    
    if (process.env.DEV){
        process.chdir(path.resolve(process.cwd(), "../wp-dploy-test-installation"))
    } else {
        process.chdir(process.cwd())
    }

    program
        .command("start")
        .alias("up")
        .option("-s, --stop", "Stop all running wp-dploy managed containers before starting")
        .description("Start wordpress development environment")
        .action(commands.start)
    
    program
        .command("stop")
        .alias("down")
        .option("-a, --all", "Stop all running wp-dploy managed containers")
        .description("Stop wordpress development environment")
        .action(commands.stop)

    program
        .command("deploy")
        .description("Deploy tag to selected installations")
        .option("-a, --all", "Deploy to all sites")
        .option("-t, --tag <string>", "The tag to deploy")
        .option("-b, --branch <branch>", "The branch to deploy from")
        .option("--sites <string>", "Comma separated string specifying all sites to deploy to")
        .action(commands.deploy)
    
    program
        .command("init")
        .description("Initialize dploy config")
        .action(commands.init)
    
    program
        .command("pull")
        .alias("pull-db")
        .description("Fetch database from server and setup all configured sites")
        .action(commands.db.pull)
    
    program
        .command("update")
        .alias("update-sites")
        .description("Update database with configured sites")
        .action(commands.db.update)
    
    program
        .command("list")
        .alias("ps")
        .alias("ls")
        .description("List all containers")
        .action(commands.list)
    
    program
        .command("dns")
        .alias("setup-dns")
        .description("Setup dns for configured sites")
        .action(commands.setupDns)
    
    program.parse(process.argv)
    

})()

