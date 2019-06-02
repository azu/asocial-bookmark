# asocial-bookmark

personal bookmark system.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install asocial-bookmark

Requirements:

- ECMAScript 2017+

## Usage

```js
import { AsocialBookmark } from "asocial-bookmark";

(async () => {
    if (!process.env.GH_TOKEN) {
        throw new Error("Set env GH_TOKEN=xxx");
    }
    const asocialBookmark = new AsocialBookmark({
        owner: "azu",
        repo: "mybookmarks",
        ref: "heads/master",
        token: process.env.GH_TOKEN
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
    console.log(bookmark);
})();

```


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
