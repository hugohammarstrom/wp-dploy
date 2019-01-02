import logger from "./../../logger"
import db from "./handlers/db"
import dnsmasq from "./../../dnsmasq"

export default async function(){
    let {config} = global

    await db.update(config.sites)
    await dnsmasq.setup(config.sites)
    logger.stop()
}