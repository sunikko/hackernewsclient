export interface Store {
    currentPage: number;
    feeds: NewsFeed[];
    pageSize: number;
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

  