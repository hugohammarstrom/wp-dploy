import {exec} from "child_process"
import logger from "./../logger"

export default function(command, config={}){
    return new Promise((resolve, reject) => {
        let child = exec(command)

        if (config.logging){
            child.stdout.on('data', (data) => {
                data = data.split("\n")
                data.pop()
                data.join("\n")
                logger.info(`${data}`);
            });
        }
    
        child.on("exit", (code) => {
            if(code != -1){
                resolve()
            } else {
                console.log("Something went wrong")
                process.exit(-1)
            }
        })
    })
}