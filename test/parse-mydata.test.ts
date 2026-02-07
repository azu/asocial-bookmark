import { describe, it, expect } from "vitest";
import { parseComment } from "../src/cli/hatebu-lib/parse-mydata.js";

describe("parseComment", () => {
    it("should parse tags and comment", () => {
        const result = parseComment("[tag1][tag2] comment text");
        expect(result.tags).toEqual(["tag1", "tag2"]);
        expect(result.comment).toBe("comment text");
    });

    it("should return empty tags when no tags present", () => {
        const result = parseComment("just a comment");
        expect(result.tags).toEqual([]);
        expect(result.comment).toBe("just a comment");
    });

    it("should parse tags only with empty comment", () => {
        const result = parseComment("[tag]");
        expect(result.tags).toEqual(["tag"]);
        expect(result.comment).toBe("");
    });

    it("should not treat brackets in the middle of text as tags", () => {
        const result = parseComment("[tag1] text with [bracket] in it");
        expect(result.tags).toEqual(["tag1"]);
        expect(result.comment).toBe("text with [bracket] in it");
    });

    it("should handle empty string", () => {
        const result = parseComment("");
        expect(result.tags).toEqual([]);
        expect(result.comment).toBe("");
    });
});
