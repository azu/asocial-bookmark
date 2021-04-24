#!/usr/bin/env node

const meow = require("meow");
const { createIndex } = require("../lib/cli/asocial-bookmark-create-index");
const cli = meow(`
    Usage
      $ asocial-bookmark-create-index
 
    Options
      --cwd               [Path:String] Current Working Directory. Default: process.cwd()
      --outDir            [Path:String] Output directory path. Default: process.cwd()
      --indexPropertyName [String] indexPropertyName option. Default: ""
 
    Examples
      $ asocial-bookmark-create-index
`, {
    flags: {
        cwd: {
            type: "string"
        },
        outDir: {
            type: "string"
        },
        indexPropertyName: {
            type: "string"
        }
    },
    autoHelp: true,
    autoVersion: true
});

createIndex({
    cwd: cli.flags.cwd || process.cwd(),
    outDir: cli.flags.outDir || process.cwd(),
    indexPropertyName: cli.flags.indexPropertyName
}).then(() => {
    console.log("Success!");
}).catch(error => {
    console.error(error);
});
