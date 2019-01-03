import exec from "./../exec"
import figlet from "figlet"
export default async function(args){
    
    

    figlet("containers", async (err, data) => {
        console.log(global.chalk.blue(data))
        console.log("")
        await exec(`docker ps --filter label=wp-dploy --format "table {{.Image}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}"`, {stdout: true})
        console.log("")
        process.exit(0)
    })
}