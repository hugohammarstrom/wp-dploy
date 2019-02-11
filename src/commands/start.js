import compose from "../docker-compose"
import path from "path"
import logger from "./../logger"
import configHandler from "./../handlers/config"
import dockerImagesHandler from "./../handlers/docker-images"
import exec from "../exec";
import dnsmasq from "./../dnsmasq"
import inquirer from "inquirer"
import md5 from "md5"

import config from "./../handlers/config"

export default async function(a, b){
    configHandler.loadConfig()

    

    if (Array.isArray(global.config)){
        let result = await inquirer.prompt([{
            type: "list",
            message: "Select installation to start",
            name: "installation",
            pageSize: 9,
            choices: global.config.map((installation) => {
                return installation.name
            }),
            filter: (_input) => {
                let input = _input.split(": ")[0]
                return Promise.resolve(input)
            }
        }])
        console.log(config)
        config.global.set(`installations[${md5(process.cwd())}].selected`, result.installation)
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

    let res = await compose.upAll({ cwd: path.join(process.cwd()), log: false })
    await dnsmasq.setup(config.sites)
    
    if (res.err && res.code !== 0){
        logger.error("Something went wrong:", res.err)
        logger.stop()
    } else {
        logger.success(global.chalk.green('dploy: started local wordpress environment'))
        logger.stop()
        console.log(global.chalk.yellow("dploy: it can take a couple of minutes if this is the first launch"))
    }
}