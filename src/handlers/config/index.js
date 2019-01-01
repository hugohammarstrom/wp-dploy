import fs from "fs"
import path from "path"


export default {
    loadConfig: () => {
        let config;
        try {
            config = fs.readFileSync(path.resolve(process.cwd(), "./.dployrc.json"), {encoding: "UTF8"})
        } catch (error) {
            console.log(global.chalk.red("dploy: .dployrc.json file not found, run:"), global.chalk.white("\"wp-dploy init\""))
        }

        try {
            global.config = JSON.parse(config)
        } catch (error) {
            console.log(global.chalk.red("dploy: .dployrc.json file not correct"))
            global.config = {}
        }
    }
}