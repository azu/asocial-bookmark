import glob from "glob";
import * as fs from "fs";
import * as util from "util";
import * as path from "path";
import { AsocialBookmarkItem } from "./asocial-bookmark";

const debug = require("debug")("asocial-bookmark");

const readFile = util.promisify(fs.readFile);

const flat = <T>(array: T[][]): T[] => {
    return Array.prototype.concat.apply([], array);
};

export async function collectionIndexJSON({ cwd }: { cwd: string }): Promise<AsocialBookmarkItem[]> {
    const pattern = path.join(cwd, "data/*/*/index.json");
    debug("collectionIndexJSON pattern: %s", pattern);
    const indexFilePathList = glob.sync(pattern);
    debug("collectionIndexJSON file count: %d", indexFilePathList.length);
    // [[item], [item]..]
    const fileContents = indexFilePathList.map(filePath => {
        return readFile(filePath, "utf-8").then(content => {
            return JSON.parse(content);
        });
    });
    // [item, item]
    const nextItems = await Promise.all(fileContents);
    return flat(nextItems);
}

export async function createIndexJSON({ cwd }: { cwd: string }) {
    const items = await collectionIndexJSON({ cwd });
    // will be unique?
    return items;
}
