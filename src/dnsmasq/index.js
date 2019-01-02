import compose from "./../docker-compose"
import fs from "fs";
import appRoot from "app-root-path"
import logger from "./../logger"
import exec from "./../exec"
import { isNumber } from "util";

export default {
    setup: setup
}

async function setup(sites){
    logger.info(global.chalk.yellow("dploy: setting up dns for configured sites"))
    let template = fs.readFileSync(`${appRoot.toString()}/templates/dnsmasq.conf`, {encoding: "utf8"})
    sites.forEach(site => {
        template += `address=/${site.local_url.replace("http://", "").replace("https://", "")}/127.0.0.1`
    });
    fs.writeFileSync(process.cwd() + "/env/dnsmasq.conf", template)
    logger.info(global.chalk.yellow("dploy: saved dns config file"))
    setTimeout(() => logger.info(global.chalk.yellow("dploy: restarting dnsmasq")), 500)
    await exec(`docker-compose restart dnsmasq`)
    logger.success(global.chalk.green("dploy: setup up dns for configured sites"))
    
    logger.info("dploy: checking if dns server is enabled")
    await sleep(2500)
    
    let {code} = await exec(`nslookup ${sites[0].local_url.replace("http://", "").replace("https://", "")}`, {noExit: true})
    if (code != 0){
        logger.warning("dploy: dns server not enabled, add 127.0.0.1 as a dns server to your wifi settings")
    } else {
        logger.success(global.chalk.green("dploy: dns server enabled"))
    }

    logger.stop()
}

function sleep(ms){
    return new Promise((resolve, reject) => {
        if (!isNumber(ms)) return reject()
        setTimeout(() => resolve(), ms)
    })
}