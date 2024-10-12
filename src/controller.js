import { os_service } from "./services/os_service.js";
import { navigation_service } from "./services/navigation_service.js";

const COMMANDS = {
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

/**
 * 
 * @param {string} command 
 */
async function controller(command) {
  try {
    const [cmd, ...userArgs] = command.trim().split(" ");

    const formattedArgs = userArgs.filter((arg) => arg !== "");

    const service = COMMANDS[cmd];

    if (service === undefined) {
      console.log(`Invalid input: incorrect command ${cmd}`);
    } else {
      await service({ command: cmd, args: formattedArgs });
    }
  } catch (error) {
    console.log("Operation failed");
  }
}

export { controller };
