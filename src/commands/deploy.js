import logger from "./../logger";
import configHandler from "../handlers/config";
import { exec } from "child_process";
import chalk from "chalk"
import Confirm from "prompt-confirm"
const { MultiSelect } = require('enquirer');

export default async function(args) {
  if (!args.tag) {
    logger.warning("No tag specified, using latest...")
    logger.stop()
  }
  let sites = configHandler.loadConfig();
  sites = sites.filter(site => !site.disabled && site.deployable);
  if (!args.all){
    if (args.sites){
      sites = sites.filter(site => args.sites.split(",").indexOf(site.name) !== -1)
    } else {
      const prompt = new MultiSelect({
        name: 'value',
        message: 'Select all sites (using space)',
        choices: sites.map(site => ({name: site.name, value: site.name}))
      });
      let answers = await prompt.run()
      sites = sites.filter(site => answers.indexOf(site.name) !== -1)
    }
  }
  if (sites.length == 0) return 

  console.log("\n")
  console.log(chalk.bold.yellow("The following sites will be deployed:"))
  for (let i = 0; i < sites.length; i++) {
    console.log(chalk.yellow(`- ${sites[i].name}`))
  }
  console.log("\n")

  const prompt = new Confirm({message: 'Are you sure', default: false});

  let shouldContinue = await prompt.run()
  if (!shouldContinue) return
  console.clear()
  
  for (let i = 0; i < sites.length; i++) {
    const site = sites[i];
    if (site.server) {
      console.log(chalk.bold.blue(`wp-dploy: Deploying to site ${site.name}`))
      logger.stop()
      await ssh_command({
        server: site.server,
        command: `wp-dploy-server deploy --site ${site.name} ${args.tag ? "--tag " + args.tag : ""}`
      })
    } else {
      logger.warning(`Skipping ${site.name}, no server config specified`);
    }
  }
  logger.stop();
  process.exit(0);
}

const ssh_command = async function({ server={}, command }) {
  return new Promise((resolve, reject) => {
    let child = exec(`ssh ${server.username}@${server.host} ${command}`);
    let result = {
      data: "",
      error: "",
      code: 0,
    }

    child.stdout.on("data", data => {
      data = data.split("\n")
      for (let i = 0; i < data.length; i++) {
        if(data[i].trim()){
          console.log(`${chalk.yellow(server.host)}: ${data[i]}`)
        }
      }
      result.data += data
    });

    child.stderr.on("data", error => {
      data = data.split("\n")
      for (let i = 0; i < data.length; i++) {
        if(data[i].trim()){
          console.log(`${chalk.red(server.host)}: ${data[i]}`)
        }
      }
      result.error += error;
    });

    child.on("exit", code => {
      result.code = code;
      if (code === 0 && !result.error) {
        resolve(result);
      } else {
        reject(result)
        process.exit(1);
      }
    });

    // child.stdout.pipe(process.stdout)
    // child.stderr.pipe(process.stderr)
  });
};
