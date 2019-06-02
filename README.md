# asocial-bookmark

personal bookmark system.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install asocial-bookmark

Requirements:

- ECMAScript 2017+

## Usage

GitHub mode.

```js
import { AsocialBookmark } from "asocial-bookmark";

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
```

## CLI

RUN following CLI in your bookmark repository.

Migrate はてなブックマーク to asocial-bookmark

    $ cd your-bookmarks-repository/
    $ migrate-hatenabookmark-to-asocial-bookmark --hatena <user-name>

Create `index.json` that includes all bookmarks.

    $ cd your-bookmarks-repository/
    $ asocial-bookmark-create-index


## How to create your bookmark repository

WIP: It is complex workflow.

1. Create your repository.
    - Example: `https://github.com/{your}/mybookmarks`
2. Convert existing bookmark like "はてなブックマーク" to asocial-bookmark
    - Run `$ migrate-hatenabookmark-to-asocial-bookmark --hatena <user-name>`
    - For more details, see [src/cli/migrate-hatenabookmark-to-asocial-bookmark.ts](src/cli/migrate-hatenabookmark-to-asocial-bookmark.ts)
3. Setup CI/CD - [Netlify](https://www.netlify.com/) is useful in this case
    - Run `$ asocial-bookmark-create-index` that create `index.json` before each deploy
    - Enable CORS for `https://<your-bookmark>/index.json`
    - All bookmarks: `https://<your-bookmark>/index.json`
    - All tags: `https://<your-bookmark>/tags.json`
    - Block bookmarks by month: https://<your-bookmark>/:year/:month/index.json` 

`.netlify.toml` in your bookmark repository:
```toml
# example netlify.toml
[build]
  command = "asocial-bookmark-create-index"
  functions = "functions"
  publish = "."
  #  status = 200
[[headers]]
  for = "/index.json"
  [headers.values]
    Access-Control-Allow-Origin = "*"

```


4. Post bookmark via [postem](https://github.com/azu/postem)
    - See <https://github.com/azu/postem/blob/master/src/services/asocial-bookmark/README.md>


`src/service.js` in [postem](https://github.com/azu/postem)
```js
const path = require("path");
module.exports = [
    {
        enabled: true,
        name: "twitter",
        indexPath: path.join(__dirname, "services/twitter/index.js")
    },
    {
        enabled: true,
        name: "AsocialBookmark",
        indexPath: path.join(__dirname, "services/asocial-bookmark/index.js")
    }
];
```

5. Search Bookmark on [はてなブックマーク検索PWA](https://hatebupwa.netlify.com/)
    - Input `https://<your-bookmark>/index.json` to "hatena user name" 
    - Do incremental search! 


## Changelog

See [Releases page](https://github.com/azu/asocial-bookmark/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/asocial-bookmark/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
