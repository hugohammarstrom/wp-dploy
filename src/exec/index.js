import {exec} from "child_process"
import logger from "./../logger"
import { resolveCname } from "dns";

export default function(command, config={}){
    return new Promise((resolve, reject) => {
        let child = exec(command)

        let result = {
            error: "",
            data: "",
            code: 0
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
            result.code = code
            if (code === 0 && !result.err){
                resolve(result)
            } else {
                if (config.noExit) return resolve(result)
                logger.error(global.chalk.red("dploy: something went wrong"), result.error)
                logger.stop()
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