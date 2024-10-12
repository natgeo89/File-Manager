import { homedir } from "node:os";
import path from "node:path";
import fs from "node:fs/promises";

let CURRENT_DIRECTORY = homedir();
//todo remove commented
// let CURRENT_DIRECTORY = 'D:\\NodeJS\\File-Manager';


const NAVIGATION_SERVICE_COMMANDS = {
  up: go_up,
  cd: go_to_dir,
  ls: get_list_of_files,
};

/**
 * @param {Object} service
 * @param {string} service.command
 * @param {Array} service.args
 */
async function navigation_service({ command, args }) {
  const util = NAVIGATION_SERVICE_COMMANDS[command];

  await util(args);
}

function get_current_dir() {
  return CURRENT_DIRECTORY;
}

function go_up() {
  const current_dirr = get_current_dir();
  const upper_dir = current_dirr.split(path.sep);

  if (upper_dir.length === 1) return;

  upper_dir.pop();

  if (upper_dir.length === 1) {
    CURRENT_DIRECTORY = `${upper_dir[0]}${path.sep}`;
  } else {
    CURRENT_DIRECTORY = path.join(...upper_dir);
  }
}

/**
 * 
 * @param {Array<string>} args 
 */
async function go_to_dir(args) {
  try {
    const [user_path] = args;
    const current_dirr = get_current_dir();
    
    const absolutePath = path.resolve(current_dirr, user_path);

    const stat = await fs.stat(absolutePath);

    if (stat.isDirectory()) {
      CURRENT_DIRECTORY = absolutePath;
    }
  } catch (error) {
    console.log("Operation failed. Incorrect path");
  }

}

async function get_list_of_files() {
  try {
    const current_dirr = get_current_dir();

    const files_list = await fs.readdir(current_dirr, { withFileTypes: true });

    const files_stats_promise = files_list.map((file) => {
      const path_to_file = path.join(current_dirr, file.name);

      const promise = new Promise((resolve, reject) => {
        fs.stat(path_to_file)
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
