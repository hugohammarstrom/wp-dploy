import logger from "./../../logger"
import db from "./handlers/db"
import dnsmasq from "./../../dnsmasq"
import configHandler from "./../../handlers/config"

export default async function(){
    config = configHandler.loadConfig()

    await db.update(config.sites)
    await dnsmasq.setup(config.sites)
    logger.stop()
}