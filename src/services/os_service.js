import { EOL, cpus, homedir, userInfo, arch } from "os";

const OS_SERVICE_COMMANDS = {
  "--EOL": JSON.stringify(EOL),
  "--cpus": get_cpus(),
  "--homedir": homedir(),
  "--username": userInfo().username,
  "--architecture": arch(),
};

/**
 * @param {Array} args
 */
function os_service(args) {
  if (args.length === 0 || args.length > 1) {
    console.log("Invalid input: incorrect number of arguments");
  } else {
    const [firstArgument] = args;
    const command = OS_SERVICE_COMMANDS[firstArgument];

    if (command === undefined) {
      console.log(`Invalid input: incorrect argument ${firstArgument}`);
    }

    console.log(command);
  }
}

function get_cpus() {
  const cpusData = cpus().map(({ model }, index) => `\n${index + 1}: ${model}`);

  const result = `
    Total amount of cpus: ${cpusData.length}
    ${cpusData.join("")}
    `;

  return result;
}

export { os_service };
