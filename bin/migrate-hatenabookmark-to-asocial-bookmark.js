#!/usr/bin/env node

const meow = require("meow");
const { migrate } = require("../lib/cli/migrate-hatenabookmark-to-asocial-bookmark");
const cli = meow(`
    Usage
      $ migrate-hatenabookmark-to-asocial-bookmark --hatena <user-name>
 
    Options
      --hatena Hatena User name
 
    Examples
      $ migrate-hatenabookmark-to-asocial-bookmark --hatena test
`, {
    flags: {
        hatena: {
            type: "string"
        }
    },
    autoHelp: true,
    autoVersion: true
});

migrate({
    hatenaUserName: cli.flags.hatena,
    cwd: process.cwd()
}).then(() => {
    console.log("Success!");
}).catch(error => {
    console.error(error);
});
