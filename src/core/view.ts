import { ApiNewsFeed, NewsFeed, NewsComment } from '../types'


/**
 * Fetches data from a given URL.
 *
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<any>} A promise that resolves to the fetched data.
 * @throws Will throw an error if the fetch operation fails.
 * @example
 * // Fetch data from a URL
 * const data = await getData('https://api.example.com/data');
 * console.log(data);
 */
export async function getData<Response>(url: string): Promise<Response> {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Data fetch failed");
    return await response.json();
  }

  

/**
 * Extracts the type and id from the current URL hash.
 *
 * @returns {Object} An object containing `type` and `id` from the URL hash.
 * @example
 * // If location.hash is "#/page/2"
 * const { type, id } = getHashParts();
 * console.log(type); // "page"
 * console.log(id);   // "2"
 */
export const getHashParts = () => {
    const [, type, id] = location.hash.split("/");
    return { type, id };
  };
  

  export function makeComment(comments: NewsComment[]): string {
    return comments
      .map((comment) => {
        const padding = comment.level * 40;
        const childComments =
          comment.comments.length > 0 ? makeComment(comment.comments) : "";
  
        return `
          <div style="padding-left: ${padding}px;" class="mt-4">
            <div class="text-gray-400">
              <i class="fa fa-sort-up mr-2"></i>
              <strong>${comment.user}</strong> ${comment.time_ago}
            </div>
            <p class="text-gray-700">${comment.content}</p>
          </div>
          ${childComments}
        `;
      })
      .join("");
  }
  


/**
 * Displays the details of a news item based on its ID.
 *
 * @returns {void} This function does not return anything.
 * @example
 * // To display the details of a news item with ID 123
 * newsDetail();
 */
export function updateView(html: string): void {

  const container: HTMLElement | null = document.getElementById("root");
    
  if (container) {
    container.innerHTML = html;
  } else {
    console.error("Container element not found");
  }
}


export function makeFeeds(apiFeeds: ApiNewsFeed[]): NewsFeed[] {
    return apiFeeds.map((feed) => ({
      id: feed.id,
      title: feed.title,
      user: feed.user,
      points: feed.points,
      time_ago: feed.time_ago,
      comments_count: feed.comments_count,
      content: feed.content,
      url: feed.url ?? "",
      read: false,
    }));
  }
  
  export function createNewsItem(newsFeed: NewsFeed): string {
    return `
      <div class="p-6 ${
        newsFeed.read ? "bg-gray-500" : "bg-white"
      } mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
          <div class="flex">
            <div class="flex-auto">
              <a href="#/show/${newsFeed.id}">${newsFeed.title}</a>  
            </div>
            <div class="text-center text-sm">
              <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${
                newsFeed.comments_count
              }</div>
            </div>
          </div>
          <div class="flex mt-3">
            <div class="grid grid-cols-3 text-sm text-gray-500">
              <div><i class="fas fa-user mr-1"></i>${newsFeed.user}</div>
              <div><i class="fas fa-heart mr-1"></i>${newsFeed.points}</div>
              <div><i class="far fa-clock mr-1"></i>${newsFeed.time_ago}</div>
            </div>  
          </div>
        </div>   
      `;
  }
  
  export function getHeaderTemplate(): string {
    return `
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <h1 class="font-extrabold">Hacker News</h1>
            <div class="items-center justify-end">
              <a href="#/page/{{__prev_page__}}" class="text-gray-500">Previous</a>
              <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">Next</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  