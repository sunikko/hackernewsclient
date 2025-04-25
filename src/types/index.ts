export interface NewsStore{
    getAllFeeds: () => NewsFeed[];
    getFeedByIndex: (id: number) => NewsFeed;
    setFeeds: (feeds: NewsFeed[]) => void;
    makeRead: (id: number) => void;
    hasFeeds: boolean;
    currentPage: number;
    numberOfFeeds: number;
    nextPage: number;
    prevPage: number;
}
  
export interface News {
    readonly id: number;
    readonly time_ago: string;
    readonly title: string;
    readonly url: string;
    readonly user: string;
    readonly content: string;
}
  
export interface ApiNewsFeed extends News {
    readonly points: number;
    readonly comments_count: number;
}
  
export interface NewsFeed extends ApiNewsFeed {
    read?: boolean;
}
export interface NewsDetail extends News {
    readonly comments: NewsComment[];
}
  
export interface NewsComment extends News {
    readonly comments: NewsComment[];
    readonly level: number;
}

  