#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";
import ora from "ora";
import "dotenv/config";
import { Command } from "commander";
import axios from "axios";

import * as fs from "fs";

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

const program = new Command();
const configPath = process.env.CONFIG_PATH || "config.json";

let page = 1;

const start = async () => {
	const startText = await figlet("Penguin", "Graffiti");
	console.log(chalk.blue(startText), "\n");
};

const spinner = async (startText, succeedText) => {
	const spinner = ora(startText).start();
	await sleep(1000);
	spinner.color = "blue";
	spinner.text = succeedText;
	await sleep(1500);
	spinner.stop();
};

const askTitle = async (animeName) => {
	const answers = await inquirer.prompt([
		{
			type: "input",
			name: "animeName",
			message: "Enter Anime Name 🐧",
		},
	]);

	return answers.animeName;
};

const getLink = async (animeName, page) => {
	const query = axios
		.get(`http://localhost:4000/anime/search?q=${animeName}&page=${page}`)
		.then((res) => {
			const data = res.data;
			console.log(data.animes);
			let i = 0;
			for (const anime of data.animes) {
				i++;
				console.log(`${i} - ${anime.name}`);
			}
		});
};
  
await spinner("Waking up Penguin 🐧", "Penguin has woken up 🐧");
await start();
const animeName = await askTitle();
await getLink(animeName, page);
