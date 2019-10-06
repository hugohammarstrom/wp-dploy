import logger from "./../../logger"
import fs from "fs-extra"
import path from "path"
import chalk from "chalk"

export default {
    setConfig: async (_config = {}) => {
        let configDir = path.resolve(process.cwd(), _config.wpConfig || "wp-config.php")
        if (await fs.exists(configDir)){
            logger.info(chalk.yellow("dploy: configuring wordpress"))
            let config = await fs.readFile(configDir, "utf8")
            config = config.replace(/\/\* -- WP-DPLOY-START -- \*\/(.*)\/\* -- WP-DPLOY-END -- \*\//s, "")

            config = config.trimRight()


            config += `


/* -- WP-DPLOY-START -- */

${_config.config || ""}

/* -- WP-DPLOY-END -- */
            `

            await fs.writeFile(configDir, config)
            logger.success(chalk.green("dploy: wordpress configured"))
        } else {
            if (config){
                logger.warning("dploy: no wp-config.php file found, dynamically set config not updated.")
            }
        }
    }
}