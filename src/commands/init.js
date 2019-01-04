import fs from "fs"
import inquirer from "inquirer"
import path from "path"
import appRoot from "app-root-path"
import logger from "./../logger"

export default function(){

    let cwd = appRoot.toString()

    if (fs.existsSync(path.resolve(process.cwd(), "./.dployrc.json"))){
        console.log(global.chalk.red("dploy: dploy already initialized"))
        return
    }

    inquirer.prompt([{
        type: "confirm",
        message: "Use wizard:",
        name: "use_wizard",
    },
    {
        message: "Server host:",
        name: "host",
        when: (res) => res.use_wizard,
    },
    {
        message: "Server username:",
        name: "username",
        when: (res) => res.use_wizard,
    },
    {
        message: "Wordpress installation path on server:",
        name: "install_path",
        when: (res) => res.use_wizard,
    },
    {
        message: "Siteurl:",
        name: "siteurl",
        when: (res) => res.use_wizard,
    },
    {
        message: "Local siteurl:",
        name: "local_siteurl",
        when: (res) => res.use_wizard,
    }]).then((res) => {
        let json = {
            "server": {
                "host": "example.com",
                "username": "root",
                "installation": {
                    "path": "/home/ubuntu/wp-installation"
                }
            },
            "sites": [{
                "url": "example.com",
                "local_url": "example.localhost"
            }]
        }
        logger.info("dploy: initializing project")
        if (res.use_wizard){
            json.server.host = res.host
            json.server.username = res.username
            json.server.installation.path = res.install_path
            json.sites[0].url = res.siteurl
            json.sites[0].local_url = res.local_siteurl
        } else {
            logger.warning("dploy: you need to change the placeholders in .dployrc.json before using wp-dploy pull")
        }
        
        fs.copyFileSync(`${cwd}/templates/docker-compose.yml`, path.resolve(process.cwd(), "./docker-compose.yml"))
        fs.writeFileSync(path.resolve(process.cwd(), "./.dployrc.json"), JSON.stringify(json, null, 4))


        //CREATE ENVIRONMENT FOLDERS
        if (!fs.existsSync(path.resolve(process.cwd(), "./env"))){
            fs.mkdirSync(path.resolve(process.cwd(), "./env"));
        }

        if (!fs.existsSync(path.resolve(process.cwd(), "./env/data"))){
            fs.mkdirSync(path.resolve(process.cwd(), "./env/data"));
        }

        if (!fs.existsSync(path.resolve(process.cwd(), "./env/data/mysql"))){
            fs.mkdirSync(path.resolve(process.cwd(), "./env/data/mysql"));
        }

        //ADD DNSMASQ CONFIG
        fs.copyFileSync(`${cwd}/templates/dnsmasq.conf`, path.resolve(process.cwd(), "./env/dnsmasq.conf"))

        if(!fs.existsSync(path.resolve(process.cwd(), "./.gitignore"))){
            fs.writeFileSync(path.resolve(process.cwd(), "./.gitignore"), "env")
            logger.success(global.chalk.green("dploy: added .gitignore file"))
        } else {
            logger.warning("dploy: .gitignore already exist in this directory, skipping .gitignore management")
        }

        logger.success(global.chalk.green("dploy: initialized dploy project"))
        logger.stop()

    })
}