import compose from "../docker-compose"
import path from "path"
import logger from "./../logger"
import exec from "./../exec"


export default async function(args){

    logger.createSpinner("dploy: stopping local wordpress environment")
    if(args.all){
        logger.info(global.chalk.yellow("dploy: stopping containers"))
        await exec(`docker ps -q --filter "label=wp-dploy=true" | xargs docker stop`)
        logger.info(global.chalk.yellow("dploy: removing containers"))
        await exec(`docker ps -aq --filter "label=wp-dploy=true" | xargs docker rm`)
        logger.success(global.chalk.green('dploy: stopped local wordpress environment'))
    } else {
        let res = await compose.down({ cwd: path.join(process.cwd()), log: false })
        if (res.err && res.code !== 0){
            logger.error("Something went wrong:", res.err)
        } else {
            logger.success(global.chalk.green('dploy: stopped local wordpress environment'))
        }
    }
    logger.stop()
}