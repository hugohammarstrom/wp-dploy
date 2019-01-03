import dnsmasq from "./../dnsmasq"
import configHandler from "./../handlers/config"

export default async function(){
    config = configHandler.loadConfig()
    await dnsmasq.setup(config.sites)
}