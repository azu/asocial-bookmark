import { createIndexJSON, createTagsJSON } from "../repository-collection.js";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import createDebug from "debug";

const debug = createDebug("asocial-bookmark");

export type migrateOptions = {
    cwd: string;
    outDir: string;
    indexPropertyName?: string;
};

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
