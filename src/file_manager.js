import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { controller } from "./controller.js";
import { getUserName } from "./utils.js";
import { get_current_dir } from "./services/navigation_service.js";
import { COMMANDS } from "./constants.js";


const rl = readline.createInterface({ input, output });

function greetings() {
  console.log(`Welcome to the File Manager, ${getUserName()}!`);
  console.log(`You are currently in ${get_current_dir()}`);

  rl.prompt();
}

function registerEvents() {
  rl.on("line", async (command) => {
    if (command === COMMANDS.exit) {
      rl.emit("SIGINT");
    } else {
      await controller(command);

      console.log(`You are currently in ${get_current_dir()}`);

      rl.prompt();
    }
  });

  rl.on("SIGINT", () => {
    console.log(
      `\nThank you for using File Manager, ${getUserName()}, goodbye!`
    );

    process.exit(0);
  });
}

registerEvents();
greetings();
