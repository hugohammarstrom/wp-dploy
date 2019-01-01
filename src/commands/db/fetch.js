import exec from "./../../exec"
import hostile from "hostile"
import logger from "./../../logger"
import path from "path"
import appRoot from "app-root-path"
const cwd = appRoot.toString()


export default async function(){
    let {config} = global
    logger.log(global.chalk.green("dploy: started db fetch"))

    logger.info(global.chalk.yellow("dploy: fetching db"))
    await exec(`${cwd}/bin/fetch-db.sh ${process.cwd()} ${config.server.installation.path} ${config.server.username}@${config.server.host}`, {
        logging: true
    })

    logger.success(global.chalk.green("dploy: fetched db"))

    await setupSites(config.sites)

    if (!global.isRoot){
        logger.warning("dploy: wp-dploy was not executed with root privileges, skipping /etc/host management")
    }

    logger.stop()
    process.exit(0)
}


async function setupSites(sites, i = 0){
    let site = sites[i]
    let local_url = String(site.local_url.replace("http://", "").replace("https://", ""))
    let url = String(site.url.replace("http://", "").replace("https://", ""))
    logger.info(global.chalk.yellow(`dploy: setting up site: ${local_url}`))

    setTimeout(() => logger.info(`dploy: search-replace ${url}`), 500)
    
    await exec(`${cwd}/bin/search-replace.sh ${process.cwd()} ${site.url} ${local_url}`, {
        logging: false
    })

    logger.info(`dploy: search-replace https:// to http://`)
    await exec(`${cwd}/bin/search-replace.sh ${process.cwd()} https://${local_url} http://${local_url}`, {
        logging: false
    })

    
    if(global.isRoot){
        hostile.set("127.0.0.1", local_url, (err) => {
            if(err){
                logger.error(`dploy: something went wrong when trying to add ${local_url} to /etc/hosts`, err)
            } else {
                logger.success(global.chalk.yellow(`dploy: added ${local_url} to /etc/hosts`))
            }
        })
    }

    logger.success(global.chalk.green(`dploy: site: ${local_url} (${i + 1}/${sites.length})`))
    if (sites.length-1 > i){
        await setupSites(sites, i + 1)
    }
}