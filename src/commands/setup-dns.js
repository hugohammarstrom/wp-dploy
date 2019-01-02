import dnsmasq from "./../dnsmasq"
export default async function(){
    let {config} = global
    await dnsmasq.setup(config.sites)
}