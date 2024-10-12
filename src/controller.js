import { os_service } from "./services/os_service.js";
import { navigation_service } from "./services/navigation_service.js";

const SERVICES = {
  up: navigation_service,
  cd: navigation_service,
  ls: navigation_service,
  cat: "cat",
  add: "add",
  rn: "rn",
  cp: "cp",
  mv: "mv",
  rm: "rm",
  os: os_service,
  hash: "hash",
  compress: "compress",
  decompress: "decompress",
};

const ARGS_CORRECT_NUMBER = {
  up: 0,
  ls: 0,
  cd: 1,
  cat: 1,
  add: 1,
  rm: 1,
  os: 1,
  hash: 1,
  rn: 2,
  cp: 2,
  mv: 2,
  compress: 2,
  decompress: 2,
};

/**
 *
 * @param {string} command
 */
async function controller(command) {
  try {
    const [cmd, ...userArgs] = command.trim().split(" ");

    const formattedArgs = userArgs.filter((arg) => arg !== "");

    const service = SERVICES[cmd];

    if (service === undefined) {
      console.log(`Invalid input: incorrect command ${cmd}`);

      return;
    }

    if (!is_arguments_valid({ command: cmd, args: formattedArgs })) {
      console.log("Invalid input: incorrect number of arguments");
    } else {
      await service({ command: cmd, args: formattedArgs });
    }
  } catch (error) {
    console.log("Operation failed");
  }
}

/**
 *
 * @param {Object} obj
 * @param {string} obj.command
 * @param {Array<string>} obj.args
 * @returns {boolean}
 */
function is_arguments_valid({ command, args }) {
  const numberCorrectArgs = ARGS_CORRECT_NUMBER[command];

  if (numberCorrectArgs === undefined) return false;

  return numberCorrectArgs === args.length;
}

export { controller };
