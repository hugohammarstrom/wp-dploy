import figlet from "figlet"

export default function(program){
    figlet("wp dploy", function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(global.chalk.blue(data))
        console.log("")
        console.log("")
        program.outputHelp();
        console.log("")
    });
}