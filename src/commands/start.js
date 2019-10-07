import logger from "./../logger"
import dockerImagesHandler from "./../handlers/docker-images"
import exec from "../exec";
import dnsmasq from "./../dnsmasq"
import installationHandler from "./../handlers/installation"
import wordpressHandler from "./../handlers/wordpress"
import boxen from "boxen"
import htaccessHandler from "./../handlers/htaccess"


import stop from "./stop"

export default async function(args){
    let config = await installationHandler.getSelected()

    
    if (args.stop){
        let {data: ids} = await exec(`docker ps --filter "label=wp-dploy=true" --format "{{.ID}}"`)
        if (ids != ""){
            await stop({all: true})
        }
    }
    
    logger.info(global.chalk.yellow("dploy: checking if images exists"))

    let needsPull = await dockerImagesHandler.needsPull()

    if (needsPull){
        logger.warning("dploy: all images does not exist... pulling images")
        logger.log("")
        logger.stop()
    
        await exec("docker-compose pull --ignore-pull-failures", {stderr: true})
    
        logger.log("")
        logger.success(global.chalk.green("dploy: pulled images"))
    } else {
        logger.success(global.chalk.green("dploy: images exists"))
    }


    setTimeout(() => logger.info(global.chalk.yellow("dploy: starting local wordpress environment")))
    let res = await exec(`database_dir=./env/data/mysql/${config.sites[0].url} uploads_dir=${config.uploadsDir || ""} wordpress_image="${config.wordpressImage || ""}" docker-compose up -d`)


    await dnsmasq.setup(config.sites)
    await wordpressHandler.setConfig(config)
    await htaccessHandler.setConfig(config)
    
    if (res.err && res.code !== 0){
        logger.error("Something went wrong:", res.err)
        logger.stop()
    } else {
        logger.success(global.chalk.green('dploy: started local wordpress environment'))
        logger.stop()
        console.log(global.chalk.yellow("dploy: it can take a couple of minutes if this is the first launch"))
        console.log("\n")
        let link = "http://" + config.sites[0].local_url.replace("http://", "").replace("https://", "")
        console.log(global.chalk.green(boxen(link, {padding: 1})));
    }
}