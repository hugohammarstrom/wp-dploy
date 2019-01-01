import compose from "../docker-compose"
import path from "path"
import logger from "./../logger"


export default function(a, b){

    logger.createSpinner("dploy: stopping local wordpress environment")
    compose.down({ cwd: path.join(process.cwd()), log: false })
        .then((res) => { 
            if (res.err && res.code !== 0){
                logger.error("Something went wrong:", res.err)
            } else {
                logger.success(global.chalk.green('dploy: stopped local wordpress environment'))
            }
            logger.stop()
            process.exit(0)
        }, 
            err => { console.log('something went wrong:', err.message)}
        );
}