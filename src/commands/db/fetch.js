import exec from "./../../exec"
import hostile from "hostile"
import logger from "./../../logger"
import path from "path"
import appRoot from "app-root-path"


export default async function(){
    let cwd = appRoot.toString()
    let {config} = global
    logger.log(global.chalk.green("dploy: started db fetch"))

    logger.log(global.chalk.yellow("dploy: fetching db"))
    await exec(`${cwd}/bin/fetch-db.sh ${process.cwd()} ${config.server.installation.path} ${config.server.username}@${config.server.host}`, {
        logging: true
    })

    logger.success(global.chalk.green("dploy: fetched db"))

    
    
    await Promise.all(config.sites.map(async (site) => {
        let localUrl = String(site.local_url.replace("http://", "").replace("https://", ""))
        logger.log(global.chalk.yellow(`dploy: setting up site: ${localUrl}`))

        await exec(`${cwd}/bin/search-replace.sh ${process.cwd()} ${site.url} ${site.local_url}`, {
            logging: false
        })
    
        hostile.set("127.0.0.1", localUrl, (err) => {
            if(err){
                logger.error(`dploy: something went wrong when trying to add ${localUrl} to /etc/hosts`, err)
            } else {
                logger.success(global.chalk.yellow(`dploy: added ${localUrl} to /etc/hosts`))
            }
        })
    
        logger.success(global.chalk.green(`dploy: site: ${localUrl} setup`))
        return Promise.resolve()
    }))
    logger.stop()
    process.exit(0)
}