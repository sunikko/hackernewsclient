import { NewsFeed } from './types'

class Store {
    private _currentPage: number;
    private feeds: NewsFeed[];
    private _pageSize: number;

    constructor() {
        this._currentPage = 1;
        this.feeds = [];
        this._pageSize = 5;
    }

    get currentPage(): number {
        return this._currentPage;
    }

    set currentPage(page: number) {
        if (page < 1) {
            throw new Error("Page number cannot be less than 1");
        }
        this._currentPage = page;
    }

    get nextPage(): number {
        return this._currentPage + 1;
    }

    get prevPage(): number {
        return this._currentPage > 1? this._currentPage - 1: 1;
    }

    get feedsList(): NewsFeed[] {
        return this.feeds;
    }
    set feedsList(feeds: NewsFeed[]) {
        this.feeds = feeds;
    }
    get numberOfFeeds(): number {
        return this.feeds.length;
    }
    get hasFeeds(): boolean {
        return this.feeds.length > 0;
    }
    get pageSize(): number {
        return this._pageSize;
    }

    set pageSize(size: number) {
        if (size < 1) {
            throw new Error("Page size cannot be less than 1");
        }
        this._pageSize = size;
    }
    getAllFeeds(): NewsFeed[] {
        return this.feeds;
    }
    addFeed(feed: NewsFeed): void {
        this.feeds.push(feed);
    }
    removeFeed(feedId: number): void {
        this.feeds = this.feeds.filter(feed => feed.id !== feedId);
    }
    getFeedByIndex(index: number): NewsFeed | undefined {
        if (index < 0 || index >= this.feeds.length) {
            throw new Error("Index out of bounds");
        }
        return this.feeds[index];
    }
    setFeeds(feeds: NewsFeed[]): void {
        this.feeds = feeds.map(feed => ({ ...feed, read: false }));
    }
    makeFeed(id: number): void{
        const feed = this.feeds.find(feed => feed.id === id);
        if (feed) {
            feed.read = true;
        } else {
            throw new Error("Feed not found");
        }
    }
}
const store = new Store();
export default store;

