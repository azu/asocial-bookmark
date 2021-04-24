import { createIndexJSON, createTagsJSON } from "../repository-collection";
import * as fs from "fs";
import * as util from "util";
import * as path from "path";

const debug = require("debug")("asocial-bookmark");
const writeFile = util.promisify(fs.writeFile);

export interface migrateOptions {
    cwd: string;
    outDir: string;
    indexPropertyName?: string;
}

export async function createIndex(options: migrateOptions) {
    debug("createIndex options %o", options);
    const items = await createIndexJSON({
        cwd: options.cwd,
        indexPropertyName: options.indexPropertyName
    });
    await writeFile(path.join(options.outDir, "index.json"), JSON.stringify(items), "utf-8");
    const tags = await createTagsJSON({
        cwd: options.cwd
    });
    await writeFile(path.join(options.outDir, "tags.json"), JSON.stringify(tags), "utf-8");
}
