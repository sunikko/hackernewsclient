import { NewsFeedApi } from '../core/api'
import { NEWS_URL } from '../config'
import { updateView, makeFeeds, getHeaderTemplate, createNewsItem } from '../core/view'
import { NewsFeed } from '../types'
import Store from '../store'

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
export default async function newsFeeds(store: Store): Promise<void> {
  // let newsFeed: NewsFeed[] = store.getAllFeeds();
  const newsList: string[] = [];
  let template = `
     <div class="bg-gray-600 min-h-screen">
      ${getHeaderTemplate()}
      <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}        
      </div>
    </div>
  `;

  if (!store.hasFeeds) {
    let api = new NewsFeedApi();
    const data = await api.getData(NEWS_URL);
    store.setFeeds(data);
  }

  for (
    let i = (store.currentPage - 1) * store.pageSize;
    i < store.currentPage * store.pageSize && i < store.numberOfFeeds;
    i++
  ) {
    newsList.push(createNewsItem(store.getFeedByIndex(i)));
  }
  template = template.replace("{{__news_feed__}}", newsList.join(""));
  template = template.replace(
    "{{__prev_page__}}",
    String(store.prevPage)
  );
  const totalPages = Math.ceil(store.numberOfFeeds / store.pageSize);
  template = template.replace(
    "{{__next_page__}}",
    String(store.nextPage)
  );

  updateView(template);
}
