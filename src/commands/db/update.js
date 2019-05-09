import logger from "./../../logger"
import db from "./handlers/db"
import dnsmasq from "./../../dnsmasq"
import installationHandler from "./../../handlers/installation"

export default async function(){
    config = await installationHandler.getSelected()

    await db.update(config.sites)
    await dnsmasq.setup(config.sites)
    logger.stop()
}