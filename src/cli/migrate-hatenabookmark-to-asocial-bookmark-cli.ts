#!/usr/bin/env node
import meow from "meow";
import { migrate } from "./migrate-hatenabookmark-to-asocial-bookmark.js";

const cli = meow(`
    Usage
      $ migrate-hatenabookmark-to-asocial-bookmark --hatena <user-name>

    Options
      --hatena Hatena User name
      --cwd    Current Working Directory

    Examples
      $ migrate-hatenabookmark-to-asocial-bookmark --hatena test
`, {
    importMeta: import.meta,
    flags: {
        hatena: {
            type: "string"
        },
        cwd: {
            type: "string"
        }
    },
    autoHelp: true,
    autoVersion: true
});

migrate({
    hatenaUserName: cli.flags.hatena as string,
    cwd: cli.flags.cwd || process.cwd()
}).then(() => {
    console.log("Success!");
}).catch(error => {
    console.error(error);
    process.exit(1);
});
