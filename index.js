#!/usr/bin/env node

import figlet from 'figlet';
import gradient from 'gradient-string';
import inquirer from 'inquirer';
import fetch from 'node-fetch'

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms))

async function opening() {
    const msg = "ALGOVERA CLI"
    figlet(msg, (err, data) => {
        console.log(gradient.pastel.multiline(data))
    })
    await sleep();
    console.log(`
    This is version 0.1.0 of Algovera CLI.
    Only a small set of functions are currently available through the CLI, 
    but we will be rolling out new features soon.  
    `)
}

async function postData(url = '', data = {}) {

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    return response.json()
}

async function menu() {
    const answers = await inquirer.prompt({
        name: 'menu',
        type: 'list',
        message: 'Menu:',
        choices: ["Create a team on AlgoveraSquad's Github", "Exit"]
    })
    const result = await answers.menu
    return result
}

async function askTeamName() {
    const answers = await inquirer.prompt({
        name: 'team_name',
        type: 'input',
        message: 'Give your team a name:'
    })
    return answers.team_name
}

async function askUsernames() {
    const answers = await inquirer.prompt({
        name: 'usernames',
        type: 'input',
        message: 'Enter the github usernames of the people you want to add to the team, seperated by a comma (, ):\n eg. NobertW, ClaudeS\n>',

    })
    const result = answers.usernames.replace(/[\s]/g, "").split(",");
    return result
    
}

await opening()
if (await menu() !== "Exit") {
    const name = await askTeamName()
    const usernames = await askUsernames()

    postData('http://159.223.218.119/', { name: name, usernames: usernames })
    .then(data => {
        console.log(data.message)
    })
} else {
    process.exit(0)
}

