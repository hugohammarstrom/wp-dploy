import fs from "fs-extra"
import path from "path"
import _ from "lodash"

const homedir = require('os').homedir()

const functions = {
    loadConfig: () => {
        let config;
        try {
            config = fs.readFileSync(path.resolve(process.cwd(), "./.dployrc.json"), {encoding: "UTF8"})
        } catch (error) {
            console.log(global.chalk.red("dploy: .dployrc.json file not found, run:"), global.chalk.white("\"wp-dploy init\""))
            process.exit(1)
        }

        try {
            global.config = JSON.parse(config)
            return global.config
        } catch (error) {
            console.log(global.chalk.red("dploy: .dployrc.json file not correct"))
            global.config = {}
            process.exit(1)
        }
    },
    global: {
        get: async (key, defaultValue) => {
            let dir = path.resolve(homedir, ".wpdploy/config.json")
            await functions.global.ensure()
            let json = await fs.readJSON(dir)
            return _.get(json, key, defaultValue)
        },
        set: async (key, value) => {
            let dir = path.resolve(homedir, ".wpdploy/config.json")
            await functions.global.ensure()
            let json = await fs.readJSON(dir)
            json = _.set(json, key, value)
            await fs.writeJSON(dir, json)
            return
        },
        ensure: async () => {
            let dir = path.resolve(homedir, ".wpdploy")
            await fs.ensureDir(dir)
            if (!await fs.exists(path.resolve(dir, "./config.json"))){
                await fs.writeJSON(path.resolve(dir, "./config.json"), {})
            }
            return
        }
    }
}

export default functions