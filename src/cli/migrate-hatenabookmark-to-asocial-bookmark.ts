import { fetchHatenaBookmarks } from "./hatebu-lib/bookmark-fetch.js";
import { AsocialBookmark } from "../asocial-bookmark.js";
import createDebug from "debug";

const debug = createDebug("asocial-bookmark");

export type migrateOptions = {
    hatenaUserName: string;
    cwd: string;
};

export async function migrate(options: migrateOptions) {

    if (!options.hatenaUserName) {
        throw new Error("should set --hatena");
    }
    debug("Migrate options %o", options);
    const bookmarks = await fetchHatenaBookmarks(options.hatenaUserName, {
        reload: false
    });
    const asocialBookmark = new AsocialBookmark({
        local: {
            cwd: options.cwd
        }
    });
    console.log("Start migrating...\n" +
        "Tips: DEBUG=asocial-bookmark:* migrate-hatenabookmark-to-asocial-bookmark show progress logs");
    debug("To Update items: %d", bookmarks.length);
    for (const bookmark of bookmarks) {
        debug("Update item: %s", bookmark.url);
        await asocialBookmark.updateBookmark({
            title: bookmark.title,
            url: bookmark.url,
            tags: bookmark.tags,
            content: bookmark.comment,
            date: new Date(bookmark.date.getTime() - (bookmark.date.getTimezoneOffset() * 60000)).toISOString()
        });
    }
    return;
}
