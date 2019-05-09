import exec from "./../../exec"
import logger from "./../../logger"
import path from "path"
import appRoot from "app-root-path"
const cwd = appRoot.toString()
import dnsmasq from "./../../dnsmasq"
import db from "./handlers/db"
import installationHandler from "./../../handlers/installation"

export default async function(){
    config = await installationHandler.getSelected()
    await db.fetch(config)
    await db.update(config.sites)
    await dnsmasq.setup(config.sites)

    logger.stop()
}