#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";
import ora from "ora";
import { Command } from "commander";
import axios from "axios";
import { exec } from "child_process";
import os from "os";

const url = `https://penguincliapi.azurewebsites.net/anime/`;
const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const category = "sub";
const server = "vidstreaming";
let page = 1;

async function checkMpvInstalled() {
	exec("mpv", (error, stdout, stderr) => {
		if (error) {
			console.log("MPV is not installed. Please install MPV first.");
			console.log(
				"You can install MPV by running the following batch file:"
			);
			console.log(
				`https://rawcdn.githack.com/IJPenguin/Penguin-Cli/bacd6521ec7e540a458027a30d39018fc6ad01cb/bin/install_mpv.bat`
			);
			return;
		}
	});
}

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
		errorHandle(err);
		process.exit();
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
		errorHandle(err);
	}

	return episodeId;
};

const getLink = async (animeName, page, server, category) => {
	const animeId = await getAnimeId(animeName, page);
	const episodeId = await getEpisodeId(animeId);
	let animeLink, subLinks, subLink;
	const spinnerText = "Fetching Episode Link...";
	const succeedText = "Episode Link retrieved successfully.";
	try {
		await spinner(spinnerText, succeedText, 1000);

		const res = await axios.get(
			`${url}episode-srcs?id=${episodeId}&server=${server}&category=${category}`
		);
		const data = res.data;
		animeLink = data.sources[0].url;
		subLinks = data.tracks;
		for (let sub of subLinks) {
			if (sub.label === "English") {
				subLink = sub.file;
				break;
			}
		}
		return { animeLink, subLink };
	} catch (err) {
		errorHandle(err);
		process.exit();
	}
};

const play = async (animeLink, subLink) => {
	const command = `mpv ${animeLink} --sub-file=${subLink}`;
	const spinnerText = "Starting the Stream...";
	const succeedText = "Anime is playing...";
	try {
		await spinner(spinnerText, succeedText, 5000);
		const { stdout, stderr } = exec(command);
	} catch (error) {
		errorHandle(error);
		process.exit();
	}
};

const errorHandle = (err) => {
	console.log(chalk.red("A Server Error Occurred 🐧🔧"));
	console.log(err.name);
	console.log(err.message);
};

await checkMpvInstalled();
await spinner("Waking up Penguin 🐧", "Penguin has woken up 🐧", 200);
await start();
const animeName = await askTitle();
const { animeLink, subLink } = await getLink(animeName, page, server, category);
play(animeLink, subLink);
