import {os_service} from "./services/os_service.js";

const COMMANDS = {
  up: "up",
  cd: "cd",
  ls: "ls",
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

function controller(command) {
  try {
    const [cmd, ...rowArgs] = command.trim().split(" ");

    const args = rowArgs.filter((arg) => arg !== "");

    const service = COMMANDS[cmd];

    if (service === undefined) {
      console.log("Invalid input");
    } else {
      service(args)
    }
  } catch (error) {
    console.log("Error on command occur", error);
  }
}

export { controller };
