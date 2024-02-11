#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";
import ora from "ora";
import "dotenv/config";
import { Command } from "commander";
import * as fs from "fs";

const program = new Command();
const configPath = process.env.CONFIG_PATH || "config.json";

figlet.text(
  "Penguin",
  {
    font: "Big",
    horizontalLayout: "full",
    verticalLayout: "full",
    width: 200,
    whitespaceBreak: true,
  },
  (err, data) => {
    if (err) {
      console.log("Something went wrong 🐧");
      console.dir(err);
      return;
    }
    console.log(chalk.cyanBright(data));
  }
);


