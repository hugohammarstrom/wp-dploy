import dnsmasq from "./../dnsmasq"
import installationHandler from "./../handlers/installation"

export default async function(){
    config = await installationHandler.getSelected()
    await dnsmasq.setup(config.sites)
}