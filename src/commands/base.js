import figlet from "figlet"
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
        program.outputHelp();
    });
}