import figlet from "figlet"
import inquirer from "inquirer"
import commands from "./../commands"
const version = require("../../package.json").version

export default function(program){
    figlet("wp dploy", function(err, data) {
        if (err) {
            console.log("Something went wrong...");
            console.dir(err);
            return;
        }
        console.log(global.chalk.blue(data))
        console.log("")
        console.log(global.chalk.blue("version:", version))
        console.log("")
        console.log("")
        inquirer.prompt([{
            type: "list",
            message: "What do you want to do?",
            name: "command",
            pageSize: 9,
            choices: [
                "help: I need help!",
                new inquirer.Separator(),   
                "init: Init wp-dploy project",
                "start: Start local environment",
                "stop: Stop local environment",
                "list: List running containers",
                "pull: pull database from server",
                "update: update sites on local database",
            ],
            filter: (_input) => {
                let input = _input.split(": ")[0]
                return Promise.resolve(input)
            }
        }]).then(result => {
            switch (result.command) {
                case "help":
                    program.outputHelp();
                    break;
                case "stop":
                    commands.stop({
                        all: true
                    })
                    break;
                case "pull":
                    commands.db.pull()
                    break;
                case "update":
                    commands.db.update()
                    break;
                default:
                    commands[result.command]()
                    break;
            }
        })
    });
}