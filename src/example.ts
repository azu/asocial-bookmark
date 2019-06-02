import { AsocialBookmark } from "./asocial-bookmark";

(async () => {
    if (!process.env.GH_TOKEN) {
        throw new Error("Set env GH_TOKEN=xxx");
    }
    const asocialBookmark = new AsocialBookmark({
        github: {
            owner: "azu",
            repo: "mybookmarks",
            ref: "heads/master",
            token: process.env.GH_TOKEN
        }
    });
    const date = new Date();
    const isoDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    await asocialBookmark.updateBookmark({
        title: "example",
        url: "https://example.com",
        content: "description for example",
        date: isoDate,
        tags: ["example"]
    });

    const bookmark = await asocialBookmark.getBookmark({
        url: "https://example.com",
        date: new Date().toUTCString()
    });
    console.log("bookmark", bookmark);
    const tags = await asocialBookmark.getTags();
    console.log("tags", tags);
})();
