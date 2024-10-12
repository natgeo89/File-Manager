import { EOL, cpus, homedir, userInfo, arch } from "node:os";

const OS_SERVICE_COMMANDS = {
  "--EOL": JSON.stringify(EOL),
  "--cpus": get_cpus(),
  "--homedir": homedir(),
  "--username": userInfo().username,
  "--architecture": arch(),
};

/**
 * @param {Object} service
 * @param {string} service.command
 * @param {Array<string>} service.args
 */
function os_service({ args }) {
  if (args.length === 0 || args.length > 1) {
    console.log("Invalid input: incorrect number of arguments");
  } else {
    const [firstArgument] = args;
    const result =
      OS_SERVICE_COMMANDS[firstArgument] ??
      `Invalid input: incorrect argument ${firstArgument}`;

    console.log(result);
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
