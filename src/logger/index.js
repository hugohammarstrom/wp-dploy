import ora from "ora"

const functions = {
    createSpinner: function(message){
        global.spinner = ora(global.chalk.green(message || 'dploy')).start();
    },
    stop: function(){
        if(global.spinner){
            global.spinner.stop()
            global.spinner = undefined
        }
    },
    success: function(message){
        if(global.spinner){

            global.spinner.text = message
            global.spinner.succeed()
            global.spinner.text = ""
            global.spinner.start()
            return
        } else {
            functions.createSpinner()
            functions.success(message)
        }

    },
    error: function(message, err){
        if(global.spinner){

            global.spinner.text = message
            global.spinner.fail()
            console.error(err)
            global.spinner.text = ""
            global.spinner.start()
            return
        } else {
            functions.createSpinner()
            functions.error(message, err)
        }

    },
    warning: function(message){
        if(global.spinner){
            global.spinner.text = global.chalk.yellow(message)
            global.spinner.stopAndPersist({
                symbol: "⚠"
            })
            global.spinner.text = ""
            global.spinner.start()
            return
        } else {
            functions.createSpinner()
            functions.warning(message)
        }
    },
    log: function(message){
        if(global.spinner){
            global.spinner.text = message
            global.spinner.stopAndPersist()
            global.spinner.text = ""
            global.spinner.start()
            return
        } else {
            functions.createSpinner()
            functions.log(message)
        }
    },
    info: function(message){
        if(global.spinner){
            global.spinner.text = message
            return
        } else {
            functions.createSpinner()
            functions.info(message)
        }
    }
}

export default functions