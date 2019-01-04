import compose from "../docker-compose"
import path from "path"
import logger from "./../logger"
import configHandler from "./../handlers/config"
import exec from "../exec";


export default async function(a, b){
    configHandler.loadConfig()
    
    console.log(global.chalk.yellow("dploy: pulling images"))
    logger.log("")
    logger.stop()

    await exec("docker-compose pull", {stderr: true})

    logger.log("")
    logger.success(global.chalk.green("dploy: pulled images"))

    setTimeout(() => logger.info(global.chalk.yellow("dploy: starting local wordpress environment")))

    let res = await compose.upAll({ cwd: path.join(process.cwd()), log: false })
    
    if (res.err && res.code !== 0){
        logger.error("Something went wrong:", res.err)
        logger.stop()
    } else {
        logger.success(global.chalk.green('dploy: started local wordpress environment'))
        logger.stop()
        console.log(global.chalk.yellow("dploy: it can take a couple of minutes if this is the first launch"))
    }
}