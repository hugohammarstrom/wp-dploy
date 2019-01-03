import compose from "../docker-compose"
import path from "path"
import logger from "./../logger"
import configHandler from "./../handlers/config"


export default function(a, b){
    configHandler.loadConfig()
    logger.createSpinner("dploy: start local wordpress environment")
    compose.upAll({ cwd: path.join(process.cwd()), log: false })
        .then((res) => { 
            if (res.err && res.code !== 0){
                logger.error("Something went wrong:", res.err)
                logger.stop()
            } else {
                logger.success(global.chalk.green('dploy: started local wordpress environment'))
                logger.stop()
                console.log(global.chalk.yellow("dploy: it can take a couple of minutes if this is the first launch"))
            }
            process.exit(0)
        }, 
            err => { 
                logger.error('Something went wrong:', err.message)
                logger.stop()
            }
        );
}