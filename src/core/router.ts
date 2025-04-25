import { newsDetail, newsFeeds} from '../page'
import { getHashParts, updateView} from '../core/view'
import Store from '../store'

/**
 * Routes the application based on the current URL hash.
 * It calls the corresponding function for the specified route type (page, show, etc.)
 *
 * If no route is found, it defaults to showing the news feed.
 *
 * @returns {void} This function does not return anything.
 * @example
 * // If location.hash is "#/page/2", it will call the `newsFeeds` function with page 2.
 * router();
 */
export default async function router(store: Store): Promise<void> {
    const { type, id } = getHashParts();
  
    switch (type) {
      case undefined:
        return await newsFeeds(store);
      case "page":
        const page = Number(id);
        if (!page || page < 1 || page > store.pageSize || isNaN(page)) return;
        store.currentPage = page;
        return await newsFeeds(store);
      case "show":
        return await newsDetail(store);
      default:
        updateView(`<h2>Page not found</h2>`);
    }
  };
  
