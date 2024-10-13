import { os_service } from "./services/os_service.js";
import { navigation_service } from "./services/navigation_service.js";
import { ARGS_CORRECT_NUMBER, COMMANDS } from "./constants.js";

const SERVICES = {
  [COMMANDS.up]: navigation_service,
  [COMMANDS.cd]: navigation_service,
  [COMMANDS.ls]: navigation_service,
  [COMMANDS.cat]: "cat",
  [COMMANDS.add]: "add",
  [COMMANDS.rn]: "rn",
  [COMMANDS.cp]: "cp",
  [COMMANDS.mv]: "mv",
  [COMMANDS.rm]: "rm",
  [COMMANDS.os]: os_service,
  [COMMANDS.hash]: "hash",
  [COMMANDS.compress]: "compress",
  [COMMANDS.decompress]: "decompress",
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
