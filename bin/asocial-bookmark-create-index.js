#!/usr/bin/env node

const meow = require("meow");
const { createIndex } = require("../lib/cli/asocial-bookmark-create-index");
const cli = meow(`
    Usage
      $ asocial-bookmark-create-index
 
    Examples
      $ asocial-bookmark-create-index
`, {
    autoHelp: true,
    autoVersion: true
});

createIndex({
    cwd: process.cwd()
}).then(() => {
    console.log("Success!");
}).catch(error => {
    console.error(error);
});
