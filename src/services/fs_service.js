import fsPromises from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import path from "node:path";

import { get_current_dir } from "./navigation_service.js";
import { COMMANDS } from "../constants.js";

const FS_SERVICE_COMMANDS = {
  [COMMANDS.cat]: read_file,
  [COMMANDS.add]: create_file,
  [COMMANDS.rn]: rename_file,
  [COMMANDS.cp]: copy_file,
  [COMMANDS.mv]: move_file,
  [COMMANDS.rm]: delete_file,
};

/**
 * @param {Object} service
 * @param {string} service.command
 * @param {Array} service.args
 */
async function fs_service({ command, args }) {
  const util = FS_SERVICE_COMMANDS[command];

  await util(...args);
}

/**
 *
 * @param {string} path_to_file
 */
async function read_file(path_to_file) {
  try {
    const current_dirr = get_current_dir();

    const read_file_path = path.resolve(current_dirr, path_to_file);

    const stat = await fsPromises.stat(read_file_path);

    if (stat.isFile()) {
      const readable_stream = createReadStream(read_file_path, "utf-8");

      readable_stream.on("data", (chunk) => {
        process.stdout.write(`${chunk}\n`);
      });
    }

    if (stat.isDirectory()) {
      console.log(
        "Operation failed. You pass directory instead of file to read"
      );
    }
  } catch (error) {
    console.log("Operation failed. No such file");
  }
}

/**
 * @param {string} new_file_name
 */
async function create_file(new_file_name) {
  try {
    const current_dirr = get_current_dir();
    const new_file_path = path.resolve(current_dirr, new_file_name);

    await fsPromises.writeFile(new_file_path, "", { flag: "wx" });
  } catch (err) {
    if (err.code === "EEXIST") {
      console.log("Operation failed. File already exists");
    } else {
      console.log("Operation failed");
    }
  }
}

/**
 * @param {string} path_to_file
 * @param {string} new_filename
 */
async function rename_file(path_to_file, new_filename) {
  try {
    const current_dirr = get_current_dir();
    const file_path = path.resolve(current_dirr, path_to_file);

    const stat = await fsPromises.stat(file_path);

    if (stat.isDirectory()) {
      console.log("Operation failed. Provided path to the directory, not file");
    }

    if (stat.isFile()) {
      const __dirname = path.dirname(file_path);

      const new_file_path = path.join(__dirname, new_filename);

      await fsPromises.rename(file_path, new_file_path);
    }
  } catch (err) {
    console.log("Operation failed");
  }
}

/**
 * @param {string} path_to_file
 * @param {string} path_to_new_directory
 */
async function copy_file(path_to_file, path_to_new_directory) {
  try {
    const current_dirr = get_current_dir();
    const file_path = path.resolve(current_dirr, path_to_file);
    const file_name = path.basename(file_path);
    const destination_path = path.resolve(
      current_dirr,
      path_to_new_directory,
      file_name
    );

    const stat = await fsPromises.stat(file_path);

    if (stat.isFile()) {
      const readable_stream = createReadStream(file_path);
      const writable_stream = createWriteStream(destination_path);

      await pipeline(readable_stream, writable_stream);
    }

    if (stat.isDirectory()) {
      console.log("Operation failed. Provided path to the directory, not file");
    }
  } catch (err) {
    console.log("Operation failed");
  }
}

/**
 * @param {string} path_to_file
 */
async function delete_file(path_to_file) {
  try {
    const current_dirr = get_current_dir();
    const file_path = path.resolve(current_dirr, path_to_file);

    await fsPromises.unlink(file_path);
  } catch (err) {
    console.log("Operation failed");
  }
}

/**
 * @param {string} path_to_file
 * @param {string} path_to_new_directory
 */
async function move_file(path_to_file, path_to_new_directory) {
  try {
    await copy_file(path_to_file, path_to_new_directory);
    await delete_file(path_to_file);
  } catch (err) {
    console.log("Operation failed");
  }
}

export { fs_service };
