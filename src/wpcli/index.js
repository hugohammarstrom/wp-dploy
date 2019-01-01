import compose from "docker-compose"

export default function(){

    this.cli = function(command){
        return compose.run("wpcli", "wp " + command, {
            cwd: process.cwd(),
            log: false
        })
    }
}