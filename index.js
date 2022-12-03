#!/usr/bin/env node

import gradient from 'gradient-string';
import chalk from "chalk";
import inquirer from "inquirer";
import {
    createSpinner
} from 'nanospinner';
import figlet from 'figlet';
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

let api_key;
const delay = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));

async function uploadFile(filePath) {

    var data = new FormData();
    data.append('file', fs.createReadStream(filePath));

    var config = {
        method: 'post',
        url: 'https://htki91o067.execute-api.us-east-1.amazonaws.com/upload',
        headers: {
            ...data.getHeaders(),
            "x_palapala_api_key": api_key
        },
        data: data
    };
    try {
        const res = await axios(config);
        return res.data["id"];
    } catch (err) {
        if (err.toString().includes("no such file")) {
            console.log(chalk.red("\n\nNo such file exists."));
            console.log(chalk.red("Enter full path if not in current folder. ex: C:\\Users\\91931\\Desktop\\x.jpg"))
        }
    }
}

async function printAwesomeText() {

    const msg = 'PALA PALA'
    figlet(msg, function (err, data) {
        console.log(gradient('red', 'blue').multiline(data))
    });
}

async function acceptAPIKey() {
    const answer = await inquirer.prompt({
        name: 'api_key',
        type: 'input',
        message: ' To get API keys, contact: https://twitter.com/yashhdixit | Enter your API key: \n',
    });

    api_key = answer.api_key;
}

async function getFilePath() {
    const answer = await inquirer.prompt({
        name: 'file_to_be_uploaded',
        type: 'input',
        message: 'Path which file to upload: \n',
    });

    return answer.file_to_be_uploaded;
}

async function main() {
    // console.log();

    await acceptAPIKey();
    const spinner = createSpinner('Checking if API key is valid...').start();
    if (!api_key) {
        spinner.error();
        process.exit(1);
    }
    spinner.success("Correct");

    const pathToBeUploaded = await getFilePath();

    createSpinner('Uploading your file').start();

    const link_id = await uploadFile(pathToBeUploaded); // checks if API key is correct. 


    if (!link_id) {
        console.log("\n");
        console.log(chalk.bgYellow("i guess the api_key is wrong"));
        process.exit(0);
    }

    console.log(chalk.bgCyan("\nHere's the link:"), `https://img.palapala.xyz/${link_id}`, '\n');
    process.exit(0)
}

await printAwesomeText();
await delay(1000);
await main();