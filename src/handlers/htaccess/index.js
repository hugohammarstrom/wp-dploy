import logger from "./../../logger"
import fs from "fs-extra"
import path from "path"
import chalk from "chalk"

export default {
    setConfig: async (site) => {
        let configDir = path.resolve(process.cwd(), "./.htaccess")
        let _config = "" 

        if (await fs.exists(configDir)){
            logger.info(chalk.yellow("dploy: configuring htaccess"))
            let config = await fs.readFile(configDir, "utf8")

            if (site.production_url){
                _config = `RewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_URI} ^/wp-content/uploads/(.+) [NC]\nRewriteRule ^(.*\.(js|css|png|jpe?g|gif|ico)) http://${site.production_url.replace("https://", "").replace("http://", "")}/$1 [NC,R,L]\n`
            }
            
            config = config.replace(/# -- WP-DPLOY-START --[ ]{0,}(?:.*)# -- WP-DPLOY-END --[ ]{0,}/s, `# -- WP-DPLOY-START --\n# -- WP-DPLOY-END --`)
            config = config.replace(/# -- WP-DPLOY-START --[ ]{0,}(?:.*)# -- WP-DPLOY-END --[ ]{0,}/s, `# -- WP-DPLOY-START --\n${_config}\n# -- WP-DPLOY-END --`)

            config = config.trimRight()



            await fs.writeFile(configDir, config)
            logger.success(chalk.green("dploy: htaccess configured"))
        } else {
            if (config){
                logger.warning("dploy: no .htaccess file found, dynamically set config not updated.")
            }
        }
    }
}