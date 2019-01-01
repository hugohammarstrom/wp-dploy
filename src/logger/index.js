import ora from "ora"

const functions = {
    createSpinner: function(message){
        global.spinner = ora(global.chalk.green(message || 'dploy')).start();
    },
    stop: function(){
        global.spinner.stop()
        global.spinner = undefined
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
            functions.succees(message)
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