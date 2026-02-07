import { globSync } from "glob";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { AsocialBookmarkItem } from "./asocial-bookmark.js";
import { from } from "fromfrom";
import createDebug from "debug";

const debug = createDebug("asocial-bookmark");

export async function collectionIndexJSON({
                                              cwd,
                                              indexPropertyName
                                          }: { cwd: string, indexPropertyName?: string; }): Promise<AsocialBookmarkItem[]> {
    const pattern = path.join(cwd, "data/*/*/index.json");
    debug("collectionIndexJSON pattern: %s", pattern);
    const indexFilePathList = globSync(pattern);
    debug("collectionIndexJSON file count: %d", indexFilePathList.length);
    // [[item], [item]..]
    const fileContents = indexFilePathList.map(filePath => {
        return readFile(filePath, "utf-8").then(content => {
            const json = JSON.parse(content);
            if (indexPropertyName) {
                return json[indexPropertyName];
            }
            return json;
        });
    });
    // [item, item]
    const nextItems = await Promise.all(fileContents);
    return nextItems.flat();
}

export async function createIndexJSON({ cwd, indexPropertyName }: { cwd: string; indexPropertyName?: string }) {
    const items = await collectionIndexJSON({ cwd, indexPropertyName });
    // TODO: Will be unique more by `url` key?
    return from(items)
        .sortByDescending(item => item.date)
        .distinct() // unique ===
        .toArray();
}

export async function createTagsJSON({ cwd }: { cwd: string }) {
    const items = await collectionIndexJSON({ cwd });
    return from(items)
        .flatMap(item => item.tags ?? [])
        .distinct()
        .sortBy()
        .toArray();
}
