import { createFsAdaptor, createGitHubAdaptor, createKoreFile, KoreFile } from "korefile";
import dayjs from "dayjs";
import { from } from "fromfrom";
import normalizeUrl from "normalize-url";

const debug = require("debug")("asocial-bookmark");

export interface AsocialBookmarkItem {
    title: string;
    // unique key
    url: string;
    content: string;
    tags: string[];
    date: string;
    viaURL?: string;
    relatedLinks?: { title: string, url: string }[]
}

export interface AsocialBookmarkOptions {
    github?: {
        owner: string;
        repo: string;
        ref: string;
        token: string;
    };
    local?: {
        cwd: string;
    }
}

const createPermalink = (variablePath: string, date: Date) => {
    const day = dayjs(date);
    return variablePath.replace(
        ":year", day.format("YYYY")
    ).replace(
        ":month", day.format("MM")
    );
};


const equalsUrl = (a: string, b: string): boolean => {
    return normalizeUrl(a) === normalizeUrl(b);
};

export const isAsocialBookmarkItem = (item: any): item is AsocialBookmarkItem => {
    return typeof item.title === "string" && typeof item.url === "string" && typeof item.content === "string";
};

export class AsocialBookmark {
    private koreFile: KoreFile;
    private variablePath: string;
    private tagsPath: string;

    constructor(options: AsocialBookmarkOptions) {
        this.variablePath = "data/:year/:month/index.json";
        this.tagsPath = "tags.json";
        if (options.github) {
            this.koreFile = createKoreFile({
                adaptor: createGitHubAdaptor({
                    owner: options.github.owner,
                    repo: options.github.repo,
                    ref: options.github.ref,
                    token: options.github.token
                })
            });
        } else {
            this.koreFile = createFsAdaptor({
                cwd: options.local && options.local.cwd
            });
        }
    }

    private async updateTags(newTags: string[]): Promise<void> {
        if (newTags.length === 0) {
            return;
        }
        const permalink = this.tagsPath;
        debug("updateTags: permalink", permalink);
        try {
            const allTags = await this.getTags();
            const allWithNewTags = from(allTags)
                .concat(newTags)
                .sortBy()
                .distinct()
                .toArray();
            return this.koreFile.writeFile(permalink, JSON.stringify(allWithNewTags, null, 4));
        } catch (error) {
            debug("updateTags Error", error);
            return;
        }
    }

    private async getItemsAtMonth(date: Date): Promise<AsocialBookmarkItem[]> {
        const permalink = createPermalink(this.variablePath, date);
        try {
            const response = await this.koreFile.readFile(permalink);
            return JSON.parse(response);
        } catch (error) {
            debug("getItemsAtMonth Error", error);
            return [];
        }
    }


    /**
     * Return all tags
     */
    async getTags(): Promise<string[]> {
        try {
            const response = await this.koreFile.readFile(this.tagsPath);
            return JSON.parse(response);
        } catch (error) {
            debug("getTags Error", error);
            return [];
        }
    }

    /**
     * Return all Bookmarks
     */
    async getBookmarks(): Promise<AsocialBookmarkItem[]> {
        const allIndex = "index.json";
        try {
            const response = await this.koreFile.readFile(allIndex);
            return JSON.parse(response);
        } catch (error) {
            debug("getBookmarks Error", error);
            return [];
        }
    }

    /**
     * Return a bookmark if it is found at date
     * @param url
     * @param date
     */
    async getBookmark({ url, date }: { url: string, date: string }): Promise<AsocialBookmarkItem | undefined> {
        try {
            const items = await this.getItemsAtMonth(new Date(date));
            return items.find(item => {
                return equalsUrl(item.url, url);
            });
        } catch (error) {
            debug("getBookmark Error", error);
            return;
        }
    }

    /**
     * Add or Update new bookmark
     * @param newItem
     */
    async updateBookmark(newItem: AsocialBookmarkItem) {
        const newItemDate = new Date(newItem.date);
        const permalink = createPermalink(this.variablePath, newItemDate);
        debug("updateBookmark: permalink", permalink);
        try {
            const items = await this.getItemsAtMonth(newItemDate);
            const matchIndex = items.findIndex(item => {
                return equalsUrl(item.url, newItem.url);
            });
            // remove old item
            if (matchIndex !== -1) {
                items.splice(matchIndex, 1);
            }
            const newItems = items.concat(newItem);
            await this.koreFile.writeFile(permalink, JSON.stringify(newItems, null, 4));
            await this.updateTags(newItem.tags);
        } catch (error) {
            debug("getBookmark Error", error);
            return;
        }
    }

    /**
     * Delete a bookmark that is found
     * @param url
     * @param date
     */
    async deleteBookmark({ url, date }: { url: string, date: string }) {
        const itemDate = new Date(date);
        const items = await this.getItemsAtMonth(itemDate);
        const permalink = createPermalink(this.variablePath, itemDate);
        debug("updateBookmark: permalink", permalink);
        const matchIndex = items.findIndex(item => {
            return equalsUrl(item.url, url);
        });
        // remove old item
        if (matchIndex !== -1) {
            items.splice(matchIndex, 1);
        }
        return this.koreFile.writeFile(permalink, JSON.stringify(items, null, 4));
    }
}
