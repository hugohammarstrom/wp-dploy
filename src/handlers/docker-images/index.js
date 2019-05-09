import fs from "fs"
import exec from "./../../exec"
import path from "path"

export default {
    needsPull: function() {
        return new Promise(resolve => {
            let config = fs.readFileSync(path.resolve("./docker-compose.yml"), {encoding: "utf8"})
            
            let images = config.match(/image: {0,}\S{0,}\n/g).map(match => {
                return match.replace("\n", "").replace(/image: {0,}/, "")
            })
    
    
            async function hasImage(images, i = 0){
                let {code} = await exec(`docker image inspect ${images[i]}`, {noExit: true})
                if (code != 0) return resolve(true)
                if (images.length -1 > i) hasImage(images, i + 1)
                else {
                    return resolve(false)
                }
            }
            return hasImage(images)

        })

    }
}