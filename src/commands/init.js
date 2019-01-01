import fs from "fs"
import inquirer from "inquirer"
import path from "path"
import appRoot from "app-root-path"

export default function(){

    let cwd = appRoot.toString()

    if (fs.existsSync(path.resolve(process.cwd(), "./.dployrc.json"))){
        console.log(global.chalk.yellow("dploy: dploy already initialized"))
        return
    }

    inquirer.prompt([{
        type: "confirm",
        message: "Use wizard:",
        name: "use_wizard",
    },
    /*{
        type: "confirm",
        message: "Use docker-compose file:",
        name: "use_dockerfile",
        when: (res) => res.use_wizard,
    },*/
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
            "useDockerfile": true,
            "server": {
                "host": "example.com",
                "username": "root",
                "installation": {
                    "path": "/home/ubuntu/wp-installation"
                }
            },
            "sites": [{
                "url": "http://example.com",
                "local_url": "http://example.localhost"
            }]
        }
        if (res.use_wizard){
            //json.useDockerfile = res.use_dockerfile
            json.server.host = res.host
            json.server.username = res.username
            json.server.installation.path = res.install_path
            json.sites[0].url = res.siteurl
            json.sites[0].local_url = res.local_siteurl
        }
        if (json.useDockerfile){
            fs.copyFileSync(`${cwd}/templates/docker-compose.yml`, path.resolve(process.cwd(), "./docker-compose.yml"))
        }

        fs.writeFileSync(path.resolve(process.cwd(), "./.dployrc.json"), JSON.stringify(json, null, 4))
    })
}


// {
//     "server": {
//         "host": "torresta-alpha.tk",
//         "username": "ubuntu",
//         "installation": {
//             "path": "/home/ubuntu/wp-docker/wp"
//         }
//     },
//     "sites": [{
//         "url": "http://alpha.local:8000",
//         "local_url": "http://wordpress.localhost"
//     }]
// }