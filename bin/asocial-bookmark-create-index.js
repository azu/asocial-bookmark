#!/usr/bin/env node

const meow = require("meow");
const { createIndex } = require("../lib/cli/asocial-bookmark-create-index");
const cli = meow(`
    Usage
      $ asocial-bookmark-create-index
 
    Options
      --cwd    Current Working Directory
 
    Examples
      $ asocial-bookmark-create-index
`, {
    flags: {
        cwd: {
            type: 'string'
        }
    },
    autoHelp: true,
    autoVersion: true
});

createIndex({
    cwd: cli.flags.cwd || process.cwd()
}).then(() => {
    console.log("Success!");
}).catch(error => {
    console.error(error);
});
