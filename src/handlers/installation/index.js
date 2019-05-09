import inquirer from "inquirer"
import configHandler from "./../config"
import md5 from "md5"

export default {
    getSelected: async () => {
        configHandler.loadConfig()
        let config = global.config
        
        if (Array.isArray(global.config)){
            let result = {installation: 0}
            if (global.config.length > 1){
                result = await inquirer.prompt([{
                    type: "list",
                    message: "Select installation to start",
                    name: "installation",
                    pageSize: 9,
                    choices: global.config.map((installation, i) => {
                        return {
                            name: installation.name || "no name",
                            disabled: installation.disabled ? "Disabled" : undefined
                        }
                    }),
                    filter: (input) => {
                        let index;
                        global.config.forEach((installation, i) => {
                            if (installation.name == input){
                                index = i
                            }
                        })
                        return index
                    }
                }])
            }
            configHandler.global.set(`installations[${md5(process.cwd())}].selected`, result.installation)
            config = global.config[result.installation]
        }

        return config
    }
}