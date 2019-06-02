import { createIndexJSON } from "../repository-collection";
import * as fs from "fs";
import * as util from "util";
import * as path from "path";

const debug = require("debug")("asocial-bookmark");
const writeFile = util.promisify(fs.writeFile);

export interface migrateOptions {
    cwd: string;
}

export async function createIndex(options: migrateOptions) {
    debug("createIndex options %o", options);
    const items = await createIndexJSON({
        cwd: options.cwd
    });
    return writeFile(path.join(options.cwd, "index.json"), JSON.stringify(items), "utf-8");
}
