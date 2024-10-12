import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import { controller } from "./controller.js";
import { getUserName } from './utils.js';

const rl = readline.createInterface({ input, output });

function greetings() {
  console.log(`Welcome to the File Manager, ${getUserName()}!`);

  rl.prompt();
}

function registerEvents() {
  rl.on("line", (command) => {
    if (command === ".exit") {
      rl.emit("SIGINT");
    } else {
      controller(command)

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


