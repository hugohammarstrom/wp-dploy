import logger from "./../logger";
import configHandler from "../handlers/config";
import { exec } from "child_process";
import chalk from "chalk"
import Confirm from "prompt-confirm"
const { MultiSelect, Select } = require('enquirer');

import simpleGit from "simple-git/promise"

export default async function(args) {
  let git = simpleGit(process.cwd())
  let branch = args.branch || (await git.branchLocal()).current

  if (await git.diff()){
    logger.warning("There are uncommited changes in the git repository")
    logger.stop()
  }

  if (!args.tag) {
    let commits = (await git.log([branch])).all
    commits = commits.first(15)
    
    let unpushedCommits;
    if ((await git.getRemotes()).find(remote => remote.name === "origin")){
      unpushedCommits = (await git.log({from: "origin/master", to: "master"})).all
    }

    const commitPrompt = new Select({
      name: 'color',
      message: 'Select commit to deploy',
      choices: commits.map(commit => {
        let pushed = !unpushedCommits.find(_commit => _commit.hash === commit.hash)
        return {message: `${pushed ? "" : "| " + chalk.red("not pushed to origin ")}| ${commit.author_name} - ${commit.message}`, value: commit.hash, enabled: false}
      })
    });

    args.tag = await commitPrompt.run()
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

    child.stderr.on("data", data => {
      data = data.split("\n")
      for (let i = 0; i < data.length; i++) {
        if(data[i].trim()){
          console.log(`${chalk.red(server.host)}: ${data[i]}`)
        }
      }
      result.error += data;
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


Array.prototype.first = function(num){
  return this.splice(0, num)
}