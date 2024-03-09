#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";
import ora from "ora";
import "dotenv/config";
import { Command } from "commander";
import axios from "axios";

const url = `http://localhost:4000/anime/`;
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
	await sleep(500);
	spinner.color = "blue";
	spinner.text = succeedText;
	await sleep(500);
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
	axios.get(url + `search?q=${animeName}&page=${page}`).then(async (res) => {
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
	});
	return animeId;
};

const getEpisodeId = async (animeId) => {
	let episodeId;
	axios.get(url + `episodes/${animeId}`).then(async (res) => {
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
	});
	return episodeId;
};

const getLink = async (animeName, page) => {
	let animeId;
	let episodeId;
	animeId = getAnimeId(animeName, page);
	episodeId = getEpisodeId(animeId);
};

// await spinner("Waking up Penguin 🐧", "Penguin has woken up 🐧");
await start();
const animeName = await askTitle();
const animeLink = await getLink(animeName, page);
