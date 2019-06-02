import { createGitHubAdaptor, createKoreFile, KoreFile } from "korefile";
import dayjs from "dayjs";

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
    owner: string;
    repo: string;
    ref: string;
    token: string;
}

export const createPermalink = (variablePath: string, date: Date) => {
    const day = dayjs(date);
    return variablePath.replace(
        ":year", day.format("YYYY")
    ).replace(
        ":month", day.format("MM")
    );
};

export class AsocialBookmark {
    private koreFile: KoreFile;
    private variablePath: string;

    constructor(options: AsocialBookmarkOptions) {
        this.variablePath = "data/:year/:month/index.json";
        this.koreFile = createKoreFile({
            adaptor: createGitHubAdaptor({
                owner: options.owner,
                repo: options.repo,
                ref: options.ref,
                token: options.token
            })
        });
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

    async getBookmark({ url, date }: { url: string, date: string }): Promise<AsocialBookmarkItem | undefined> {
        try {
            const items = await this.getItemsAtMonth(new Date(date));
            return items.find(item => {
                return item.url === url;
            });
        } catch (error) {
            debug("getBookmark Error", error);
            return;
        }
    }

    async updateBookmark(newItem: AsocialBookmarkItem) {
        const newItemDate = new Date(newItem.date);
        const permalink = createPermalink(this.variablePath, newItemDate);
        debug("updateBookmark: permalink", permalink);
        try {
            const items = await this.getItemsAtMonth(newItemDate);
            const matchIndex = items.findIndex(item => {
                return item.url === newItem.url;
            });
            // remove old item
            if (matchIndex !== -1) {
                items.splice(matchIndex, 1);
            }
            const newItems = items.concat(newItem);
            return this.koreFile.writeFile(permalink, JSON.stringify(newItems, null, 4));
        } catch (error) {
            debug("getBookmark Error", error);
            return;
        }
    }

    async deleteBookmark({ url, date }: { url: string, date: string }) {
        const itemDate = new Date(date);
        const items = await this.getItemsAtMonth(itemDate);
        const permalink = createPermalink(this.variablePath, itemDate);
        debug("updateBookmark: permalink", permalink);
        const matchIndex = items.findIndex(item => {
            return item.url === url;
        });
        // remove old item
        if (matchIndex !== -1) {
            items.splice(matchIndex, 1);
        }
        return this.koreFile.writeFile(permalink, JSON.stringify(items, null, 4));
    }
}
