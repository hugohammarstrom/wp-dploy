import exec from "./../../exec"
import logger from "./../../logger"
import path from "path"
import appRoot from "app-root-path"
const cwd = appRoot.toString()
import dnsmasq from "./../../dnsmasq"
import db from "./handlers/db"
import configHandler from "./../../handlers/config"

export default async function(){
    config = configHandler.loadConfig()
    await db.fetch(config)
    await db.update(config.sites)
    await dnsmasq.setup(config.sites)

    logger.stop()
}