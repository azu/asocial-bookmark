import { describe, it, expect } from "vitest";
import { createIndexJSON, createTagsJSON } from "../src/repository-collection.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { from } from "fromfrom";
import { isAsocialBookmarkItem } from "../src/asocial-bookmark.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("repository-collection", () => {
    describe("createIndexJSON", function() {
        it("should return items array", async () => {
            const index = await createIndexJSON({
                cwd: path.join(__dirname, "fixtures")
            });
            expect(index.every(isAsocialBookmarkItem)).toBe(true);
        });
    });
    describe("createTagsJSON", function() {
        it("should return tags array", async () => {
            const tags = await createTagsJSON({
                cwd: path.join(__dirname, "fixtures")
            });
            expect(Array.isArray(tags)).toBe(true);
            expect(tags).toContain("JSer");
            expect(tags.length).toBe(from(tags).distinct().toArray().length);
        });
    });
});
