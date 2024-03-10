#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";
import ora from "ora";
import "dotenv/config";
import { Command } from "commander";
import axios from "axios";
import { exec } from "child_process";
import { promises as fsPromises } from "fs";

const CONFIG_FILE_PATH = "../config.json";

async function checkAndInstallDependencies() {
	try {
		exec("mpv --version");
	} catch (error) {
		console.log("mpv is not installed. Installing...");
		exec("choco install mpv");
		console.log("mpv has been installed.");
	}
}

async function checkFirstRun() {
	try {
		const configFileContent = await fsPromises.readFile(
			CONFIG_FILE_PATH,
			"utf-8"
		);
		const config = JSON.parse(configFileContent);

		if (config.firstRun) {
			checkAndInstallDependencies();
			config.firstRun = false;
			await fsPromises.writeFile(
				CONFIG_FILE_PATH,
				JSON.stringify(config, null, 2),
				"utf-8"
			);
		}
	} catch (error) {
		console.error("Error:", error.message);

		const initialConfig = { firstRun: true };
		await fsPromises.writeFile(
			CONFIG_FILE_PATH,
			JSON.stringify(initialConfig, null, 2),
			"utf-8"
		);
	}
}

await checkFirstRun();

const url = `https://penguin.serverbot.site/anime`;
const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const category = "sub";
const server = "vidstreaming";
const program = new Command();
const configPath = process.env.CONFIG_PATH || "config.json";

let page = 1;

const start = async () => {
	const startText = await figlet("Penguin", "Graffiti");
	console.log(chalk.blue(startText), "\n");
};

const spinner = async (startText, succeedText, time) => {
	const spinner = ora(startText).start();
	await sleep(time);
	spinner.color = "blue";
	spinner.text = succeedText;
	await sleep(time);
	spinner.stop();
};

const colorizeChoices = (choices) => {
	return choices.map((choice) => chalk.green(choice));
};

const askTitle = async () => {
	const answers = await inquirer.prompt([
		{
			type: "input",
			name: "animeName",
			message: "Enter Anime Name: ",
		},
	]);

	return answers.animeName;
};

const getAnimeId = async (animeName, page) => {
	let animeId;

	const spinnerText = "Searching for anime...";
	const succeedText = "Anime information retrieved successfully.";

	try {
		await spinner(spinnerText, succeedText, 1000);

		const res = await axios.get(`${url}search?q=${animeName}&page=${page}`);
		const data = res.data;

		const animeSelector = await inquirer.prompt([
			{
				type: "list",
				name: "anime",
				message: "Select Anime",
				choices: colorizeChoices(
					data.animes.map((anime) => anime.name)
				).concat(chalk.blue("Next Page")),
			},
		]);

		if (
			animeSelector.anime === chalk.blue("Next Page") &&
			data.hasNextPage
		) {
			page++;
			await getLink(animeName, page);
		} else if (
			animeSelector.anime === chalk.blue("Next Page") &&
			!data.hasNextPage
		) {
			console.log(chalk.italic("No Next Page Available"));
			await getLink(animeName, page);
		}

		for (let anime of data.animes) {
			if (chalk.green(anime.name) === animeSelector.anime) {
				animeId = anime.id;
				break;
			}
		}
	} catch (err) {
		await spinner("", chalk.red("An Error Occurred 🐧🔧"));
	}

	return animeId;
};

const getEpisodeId = async (animeId) => {
	let episodeId;

	const spinnerText = "Fetching episode information...";
	const succeedText = "Episode information retrieved successfully.";

	try {
		await spinner(spinnerText, succeedText, 1000);

		const res = await axios.get(`${url}episodes/${animeId}`);
		const data = res.data;

		const episodeSelector = await inquirer.prompt([
			{
				type: "input",
				name: "episode",
				message: `Enter Episode Number (1 - ${data.totalEpisodes}): `,
			},
		]);

		const episode = data.episodes[episodeSelector.episode - 1];
		episodeId = episode.episodeId;
	} catch (err) {
		await spinner("", chalk.red("An Error Occurred 🐧🔧"));
	}

	return episodeId;
};

const getLink = async (animeName, page, server, category) => {
	const animeId = await getAnimeId(animeName, page);
	const episodeId = await getEpisodeId(animeId);
	let animeLink;
	const spinnerText = "Fetching Episode Link...";
	const succeedText = "Episode Link retrieved successfully.";
	try {
		await spinner(spinnerText, succeedText, 1000);

		const res = await axios.get(
			`${url}episode-srcs?id=${episodeId}&server=${server}&category=${category}`
		);
		const data = res.data;
		animeLink = data.sources[0].url;
		return animeLink;
	} catch (err) {
		console.log(chalk.red("An Error Occurred 🐧🔧"));
	}
};

const play = async (animeLink) => {
	const command = `mpv ${animeLink}`;
	const spinnerText = "Starting the Stream...";
	const succeedText = "Anime is playing...";
	try {
		await spinner(spinnerText, succeedText, 5000);
		const { stdout, stderr } = exec(command);
	} catch (error) {
		console.error(`Error: ${error.message}`);
	}
};

await spinner("Waking up Penguin 🐧", "Penguin has woken up 🐧", 200);
await start();
const animeName = await askTitle();
const animeLink = await getLink(animeName, page, server, category);
play(animeLink);
