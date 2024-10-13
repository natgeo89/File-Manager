import { createHash } from "node:crypto";
import path from "node:path";
import { createReadStream } from "node:fs";
import fsPromises from "node:fs/promises";

import { COMMANDS } from "../constants.js";
import { get_current_dir } from "./navigation_service.js";

const HASH_SERVICE_COMMANDS = {
  [COMMANDS.hash]: calc_hash,
};

/**
 * @param {Object} service
 * @param {string} service.command
 * @param {Array} service.args
 */
async function hash_service({ command, args }) {
  const util = HASH_SERVICE_COMMANDS[command];

  await util(...args);
}

/**
 *
 * @param {string} path_to_file
 */
async function calc_hash(path_to_file) {
  try {
    const hash256 = createHash("sha256");

    const current_dirr = get_current_dir();

    const file_path = path.resolve(current_dirr, path_to_file);

    const stat = await fsPromises.stat(file_path);

    if (stat.isDirectory()) {
      console.log(
        "Operation failed. You pass directory instead of file to read"
      );
    }

    if (stat.isFile()) {
      await new Promise((resolve) => {
        const read_stream = createReadStream(file_path);

        read_stream
          .on("data", (data) => {
            hash256.update(data);
          })
          .on("end", () => {
            const hash_hex = hash256.digest("hex");
            console.log(hash_hex);
            resolve();
          });
      });
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("Operation failed. Incorrect path");
    } else {
      console.log("Operation failed");
    }
  }
}

export { hash_service };
