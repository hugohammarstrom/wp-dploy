import exec from "./../exec"
import figlet from "figlet"
export default async function(){

    figlet("containers", async (err, data) => {
        console.log(global.chalk.blue(data))
        console.log("")
        await exec("docker-compose ps", {stdout: true, stderr: true})
        console.log("")
        process.exit(0)
    })
}