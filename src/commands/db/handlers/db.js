import logger from "./../../../logger"
import exec from "./../../../exec"
import appRoot from "app-root-path"
const cwd = appRoot.toString()


export default {
    fetch: fetch,
    update: update
}

async function fetch(config){

    logger.info(global.chalk.yellow("dploy: fetching db"))


    setTimeout(() => logger.info("dploy: exporting database on server"), 500)
    await exec(`ssh ${config.server.username}@${config.server.host} -t "cd ${config.server.installation.path}; sudo wp db export wordpress.sql --allow-root"`)

    logger.info("dploy: downloading database from server")
    await exec(`scp ${config.server.username}@${config.server.host}:${config.server.installation.path}/wordpress.sql wordpress.sql`)
    
    logger.info("dploy: importing database")
    await exec(`${cwd}/bin/wp.sh db import wordpress.sql`)

    logger.info("dploy: imported database to local environment")

    logger.success(global.chalk.green("dploy: fetched db"))
}


async function update(sites, i = 0){
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



    logger.success(global.chalk.green(`dploy: site: ${local_url} (${i + 1}/${sites.length})`))
    if (sites.length-1 > i){
        await update(sites, i + 1)
    }
}