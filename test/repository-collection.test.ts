import { createIndexJSON, createTagsJSON } from "../src/repository-collection";
import * as path from "path";
import * as assert from "assert";
import { from } from "fromfrom";
import { isAsocialBookmarkItem } from "../src/asocial-bookmark";

describe("repository-collection", () => {
    describe("createIndexJSON", function() {
        it("should return items array", async () => {
            const index = await createIndexJSON({
                cwd: path.join(__dirname, "fixtures")
            });
            assert.ok(index.every(isAsocialBookmarkItem), "All are isAsocialBookmarkItem");
        });
    });
    describe("createTagsJSON", function() {
        it("should return tags array", async () => {
            const tags = await createTagsJSON({
                cwd: path.join(__dirname, "fixtures")
            });
            assert.ok(Array.isArray(tags));
            assert.ok(tags.includes("JSer"));
            assert.strictEqual(tags.length, from(tags).distinct().toArray().length, "should not be duplicated");
        });
    });
});
