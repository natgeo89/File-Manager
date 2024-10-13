import path from "node:path";
import { createReadStream, createWriteStream } from "node:fs";
import zlib from "node:zlib";
import { pipeline } from "node:stream/promises";

import { COMMANDS } from "../constants.js";
import { get_current_dir } from "./navigation_service.js";

const ZLIB_SERVICE_COMMANDS = {
  [COMMANDS.compress]: compress_file,
  [COMMANDS.decompress]: decompress_file,
};

/**
 * @param {Object} service
 * @param {string} service.command
 * @param {Array} service.args
 */
async function zlib_service({ command, args }) {
  const util = ZLIB_SERVICE_COMMANDS[command];

  await util(...args);
}

/**
 *
 * @param {string} path_to_file
 * @param {string} path_to_destination
 */
async function compress_file(path_to_file, path_to_destination) {
  try {
    const current_dirr = get_current_dir();
    const file_path = path.resolve(current_dirr, path_to_file);
    const compressed_path = path.resolve(current_dirr, path_to_destination);

    const read_stream = createReadStream(file_path);
    const write_stream = createWriteStream(compressed_path);
    const brotli_compress = zlib.createBrotliCompress();

    await pipeline(read_stream, brotli_compress, write_stream);
  } catch (error) {
    if (error.code === "EISDIR") {
      console.log(
        "Operation failed. Instead of directory you need to provide directory + file name to compress"
      );
    } else {
      console.log("Operation failed");
    }
  }
}

/**
 *
 * @param {string} path_to_file
 * @param {string} path_to_destination
 */
async function decompress_file(path_to_file, path_to_destination) {
  try {
    const current_dirr = get_current_dir();
    const file_path = path.resolve(current_dirr, path_to_file);
    const decompressed_path = path.resolve(current_dirr, path_to_destination);

    const read_stream = createReadStream(file_path);
    const write_stream = createWriteStream(decompressed_path);
    const brotli_decompress = zlib.createBrotliDecompress();

    await pipeline(read_stream, brotli_decompress, write_stream);
  } catch (error) {
    if (error.code === "EISDIR") {
      console.log(
        "Operation failed. Instead of directory you need to provide directory + file name to compress"
      );
    } else {
      console.log("Operation failed");
    }
  }
}

export { zlib_service };
