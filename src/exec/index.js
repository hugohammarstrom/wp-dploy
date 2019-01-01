import {exec} from "child_process"
import logger from "./../logger"

export default function(command, config={}){
    return new Promise((resolve, reject) => {
        let child = exec(command)

        let result = {
            error: "",
            data: ""
        }

        if (config.logging){

            child.stdout.on('data', (data) => {
                data = data.split("\n")
                data.pop()
                data.join("\n")
                logger.info(`${data}`);
                result.data += data
            });
        }

        child.stderr.on("data", (error) => {
            result.error += error
        })
    
        child.on("exit", (code) => {
            if (code === 0 && !result.err){
                resolve(result.data)
            } else {
                logger.error(global.chalk.red("dploy: something went wrong"), result.error)
                logger.stop()
                process.exit(1)
            }
        })

        if (config.stdout){
            child.stdout.pipe(process.stdout)
        }

        if (config.stderr){
            child.stderr.pipe(process.stderr)
        }
    })
}