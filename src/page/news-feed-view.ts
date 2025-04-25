import { NewsFeedApi } from '../core/api'
import { NEWS_URL } from '../config'
import { updateView, makeFeeds, getHeaderTemplate, createNewsItem } from '../core/view'
import { NewsFeed } from '../types'

/**
 * Displays the list of news feeds, supporting pagination.
 *
 * It fetches the news feeds from the API if they are not already available in the store.
 * @returns {void} This function does not return anything.
 * @example
 * // To display the first page of news feeds
 * newsFeeds();
 *
 * To do: refactor -> class newsFeeds{}
 */
export default async function newsFeeds(): Promise<void> {
  let newsFeed: NewsFeed[] = window.store.feeds;
  const newsList: string[] = [];
  let template = `
     <div class="bg-gray-600 min-h-screen">
      ${getHeaderTemplate()}
      <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}        
      </div>
    </div>
  `;

  if (newsFeed.length === 0) {
    let api = new NewsFeedApi();
    const data = await api.getData(NEWS_URL);
    newsFeed = window.store.feeds = makeFeeds(data);
  }

  for (
    let i = (window.store.currentPage - 1) * window.store.pageSize;
    i < window.store.currentPage * window.store.pageSize && i < newsFeed.length;
    i++
  ) {
    newsList.push(createNewsItem(newsFeed[i]));
  }
  template = template.replace("{{__news_feed__}}", newsList.join(""));
  template = template.replace(
    "{{__prev_page__}}",
    String(window.store.currentPage > 1 ? window.store.currentPage - 1 : 1)
  );
  const totalPages = Math.ceil(newsFeed.length / window.store.pageSize);
  template = template.replace(
    "{{__next_page__}}",
    String(window.store.currentPage < totalPages ? window.store.currentPage + 1 : totalPages)
  );

  updateView(template);
}
