import { describe, it, expect, afterEach } from "vitest";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { createBookmarkFilePath, isAsocialBookmarkItem, AsocialBookmark } from "../src/asocial-bookmark.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.join(__dirname, "fixtures");

describe("createBookmarkFilePath", () => {
    it("should replace :year/:month/:day placeholders", () => {
        const date = new Date("2023-07-15T00:00:00.000Z");
        const result = createBookmarkFilePath("data/:year/:month/:day/index.json", date);
        expect(result).toBe("data/2023/07/15/index.json");
    });

    it("should replace :year/:month placeholders without :day", () => {
        const date = new Date("2019-01-10T00:00:00.000Z");
        const result = createBookmarkFilePath("data/:year/:month/index.json", date);
        expect(result).toBe("data/2019/01/index.json");
    });

    it("should handle different dates correctly", () => {
        const date = new Date("2018-12-25T00:00:00.000Z");
        const result = createBookmarkFilePath("data/:year/:month/index.json", date);
        expect(result).toBe("data/2018/12/index.json");
    });
});

describe("isAsocialBookmarkItem", () => {
    it("should return true for a valid item", () => {
        const item = {
            title: "Example",
            url: "https://example.com",
            content: "description",
            tags: ["tag1"],
            date: "2019-01-01T00:00:00.000Z",
        };
        expect(isAsocialBookmarkItem(item)).toBe(true);
    });

    it("should return false when title is missing", () => {
        const item = {
            url: "https://example.com",
            content: "description",
        };
        expect(isAsocialBookmarkItem(item)).toBe(false);
    });

    it("should return false when url is missing", () => {
        const item = {
            title: "Example",
            content: "description",
        };
        expect(isAsocialBookmarkItem(item)).toBe(false);
    });

    it("should return false when content is missing", () => {
        const item = {
            title: "Example",
            url: "https://example.com",
        };
        expect(isAsocialBookmarkItem(item)).toBe(false);
    });
});

describe("AsocialBookmark", () => {
    describe("getBookmarksAt", () => {
        it("should return bookmarks from fixtures", async () => {
            const bookmark = new AsocialBookmark({
                local: { cwd: fixturesDir },
            });
            const items = await bookmark.getBookmarksAt(new Date("2019-01-15T00:00:00.000Z"));
            expect(Array.isArray(items)).toBe(true);
            expect(items.length).toBeGreaterThan(0);
            expect(items.every(isAsocialBookmarkItem)).toBe(true);
        });

        it("should reject for non-existent date", async () => {
            const bookmark = new AsocialBookmark({
                local: { cwd: fixturesDir },
            });
            await expect(
                bookmark.getBookmarksAt(new Date("2099-01-01T00:00:00.000Z"))
            ).rejects.toThrow();
        });
    });

    describe("CRUD operations", () => {
        let tmpDir: string;

        afterEach(() => {
            if (tmpDir) {
                fs.rmSync(tmpDir, { recursive: true, force: true });
            }
        });

        it("should updateBookmark, getBookmark, and deleteBookmark", async () => {
            tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "asocial-bookmark-test-"));
            const bookmark = new AsocialBookmark({
                local: { cwd: tmpDir },
            });
            const testItem = {
                title: "Test Bookmark",
                url: "https://example.com/test",
                content: "Test content",
                tags: ["test"],
                date: "2024-03-15T12:00:00.000Z",
            };

            // Create
            await bookmark.updateBookmark(testItem);

            // Read
            const found = await bookmark.getBookmark({
                url: "https://example.com/test",
                date: "2024-03-15T12:00:00.000Z",
            });
            expect(found.title).toBe("Test Bookmark");
            expect(found.url).toBe("https://example.com/test");
            expect(found.content).toBe("Test content");
            expect(found.tags).toEqual(["test"]);

            // Delete
            await bookmark.deleteBookmark({
                url: "https://example.com/test",
                date: "2024-03-15T12:00:00.000Z",
            });

            // Verify deleted
            await expect(
                bookmark.getBookmark({
                    url: "https://example.com/test",
                    date: "2024-03-15T12:00:00.000Z",
                })
            ).rejects.toThrow("Not found item");
        });
    });
});
