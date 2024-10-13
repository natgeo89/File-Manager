import { homedir } from "node:os";
import path from "node:path";
import fsPromises from "node:fs/promises";
import { COMMANDS } from "../constants.js";

let CURRENT_DIRECTORY = homedir();

const NAVIGATION_SERVICE_COMMANDS = {
  [COMMANDS.up]: go_up,
  [COMMANDS.cd]: go_to_dir,
  [COMMANDS.ls]: get_list_of_files,
};

/**
 * @param {Object} service
 * @param {string} service.command
 * @param {Array} service.args
 */
async function navigation_service({ command, args }) {
  const util = NAVIGATION_SERVICE_COMMANDS[command];

  await util(...args);
}

function get_current_dir() {
  return CURRENT_DIRECTORY;
}

async function go_up() {
  await go_to_dir('..')
}

/**
 * 
 * @param {string} path_to_directory 
 */
async function go_to_dir(path_to_directory) {
  try {
    const current_dirr = get_current_dir();
    
    const absolute_path = path.resolve(current_dirr, path_to_directory);

    const stat = await fsPromises.stat(absolute_path);

    if (stat.isDirectory()) {
      CURRENT_DIRECTORY = absolute_path;
    }
  } catch (error) {
    console.log("Operation failed. Incorrect path");
  }
}

async function get_list_of_files() {
  try {
    const current_dirr = get_current_dir();

    const files_list = await fsPromises.readdir(current_dirr, { withFileTypes: true });

    const files_stats_promise = files_list.map((file) => {
      const path_to_file = path.join(current_dirr, file.name);

      const promise = new Promise((resolve, reject) => {
        fsPromises.stat(path_to_file)
          .then((stat) => resolve({ stat, fileName: file.name }))
          .catch(reject);
      });

      return promise;
    });

    const files_stats = (await Promise.allSettled(files_stats_promise)).filter(
      ({ status }) => status === "fulfilled"
    );

    const directories = files_stats
      .filter(({ value }) => value.stat.isDirectory())
      .map(({ value }) => ({ Name: value.fileName, Type: "directory" }))
      .sort((a, b) =>
        a.Name.toLocaleLowerCase().localeCompare(b.Name.toLocaleLowerCase())
      );

    const files = files_stats
      .filter(({ value }) => value.stat.isFile())
      .map(({ value }) => ({ Name: value.fileName, Type: "file" }))
      .sort((a, b) =>
        a.Name.toLocaleLowerCase().localeCompare(b.Name.toLocaleLowerCase())
      );

    console.table([...directories, ...files]);
  } catch (error) {
    console.log(
      "Operation failed. Impossible to read some files from this directory"
    );
  }
}

export { navigation_service, get_current_dir };
