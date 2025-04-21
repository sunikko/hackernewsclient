interface Store {
  currentPage: number;
  feeds: NewsFeed[];
}

interface News {
  readonly id: number;
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user: string;
  readonly content: string;
}

interface ApiNewsFeed extends News {
  readonly points: number;
  readonly comments_count: number;
}

interface NewsFeed extends ApiNewsFeed {
  read?: boolean;
}
interface NewsDetail extends News {
  readonly comments: NewsComment[];
}

interface NewsComment extends News {
  readonly comments: NewsComment[];
  readonly level: number;
}

const container: HTMLElement | null = document.getElementById("root");
const NEWS_URL: string = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL: string = "https://api.hnpwa.com/v0/item/@id.json";

const store: Store = {
  currentPage: 1,
  feeds: [],
};
const pageSize = 5;

/**
 * Applies mixins to a target class by copying methods from base classes.
 *
 * @param {Function} targetClass - The target class to which methods will be added.
 * @param {Array} baseClasses - An array of base classes from which methods will be copied.
 */
function applyApiMixins(targetClass: any, baseClasses: any[]): void {
  baseClasses.forEach((baseClass) => {
    Object.getOwnPropertyNames(baseClass.prototype).forEach((name) => {
      const descriptor = Object.getOwnPropertyDescriptor(
        baseClass.prototype,
        name
      );

      if (descriptor) {
        // Copy method from base class prototype to target class prototype
        Object.defineProperty(targetClass.prototype, name, descriptor);
      }
    });
  });
}

// Base API class for making HTTP requests
class Api {
  async getRequest<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return (await response.json()) as T;
  }
}

class NewsFeedApi {
  async getData(url: string): Promise<NewsFeed[]> {
    // getRequest is provided via mixin from Api
    return await this.getRequest<NewsFeed[]>(url);
  }
}

class NewsDetailApi {
  async getData(url: string): Promise<NewsDetail> {
    // getRequest is provided via mixin from Api
    return await this.getRequest<NewsDetail>(url);
  }
}

// Extend the interfaces so TypeScript recognizes the mixed-in methods
interface NewsFeedApi extends Api {}
interface NewsDetailApi extends Api {}

// Apply mixins to inject methods from Api into the specific API classes
applyApiMixins(NewsFeedApi, [Api]);
applyApiMixins(NewsDetailApi, [Api]);

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
async function getData<Response>(url: string): Promise<Response> {
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

/**
 * Displays the details of a news item based on its ID.
 *
 * @returns {void} This function does not return anything.
 * @example
 * // To display the details of a news item with ID 123
 * newsDetail();
 */
function updateView(html: string): void {
  if (container) {
    container.innerHTML = html;
  } else {
    console.error("Container element not found");
  }
}

/**
 * Displays the details of a news item based on its ID.
 *
 * @returns {void} This function does not return anything.
 * @example
 * // To display the details of a news item with ID 123
 * newsDetail();
 */
async function newsDetail(): Promise<void> {
  const { id } = getHashParts();
  if (!id) {
    return;
  }

  const api = new NewsDetailApi();
  const newsContent = await api.getData(CONTENT_URL.replace("@id", id));

  console.log(newsContent);

  let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>${newsContent.title}</h2>
        <div>
        <strong>${newsContent.user}</strong> ${newsContent.time_ago}  
      </div>
        <div class="text-gray-400 h-20">
          ${newsContent.content}
        </div>

        {{__comments__}}

      </div>
    </div>
  `;

  for (let i = 0; i < store.feeds.length; i++) {
    if (store.feeds[i].id === Number(id)) {
      store.feeds[i].read = true;
      break;
    }
  }

  updateView(
    template.replace("{{__comments__}}", makeComment(newsContent.comments))
  );
}

function makeComment(comments: NewsComment[]): string {
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

function makeFeeds(apiFeeds: ApiNewsFeed[]): NewsFeed[] {
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

function createNewsItem(newsFeed: NewsFeed): string {
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

function getHeaderTemplate(): string {
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

/**
 * Displays the list of news feeds, supporting pagination.
 *
 * @param {number} [currentPage=1] - The current page number to display (optional).
 * @returns {void} This function does not return anything.
 * @example
 * // To display the first page of news feeds
 * newsFeeds();
 */
async function newsFeeds(): Promise<void> {
  let newsFeed: NewsFeed[] = store.feeds;
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
    newsFeed = store.feeds = makeFeeds(data);
  }

  for (
    let i = (store.currentPage - 1) * pageSize;
    i < store.currentPage * pageSize && i < newsFeed.length;
    i++
  ) {
    newsList.push(createNewsItem(newsFeed[i]));
  }
  template = template.replace("{{__news_feed__}}", newsList.join(""));
  template = template.replace(
    "{{__prev_page__}}",
    String(store.currentPage > 1 ? store.currentPage - 1 : 1)
  );
  const totalPages = Math.ceil(newsFeed.length / pageSize);
  template = template.replace(
    "{{__next_page__}}",
    String(store.currentPage < totalPages ? store.currentPage + 1 : totalPages)
  );

  updateView(template);
}

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
export const router = async (): Promise<void> => {
  const { type, id } = getHashParts();

  switch (type) {
    case undefined:
      return await newsFeeds();
    case "page":
      const page = Number(id);
      if (!page || page < 1 || page > pageSize || isNaN(page)) return;
      store.currentPage = page;
      return await newsFeeds();
    case "show":
      return await newsDetail();
    default:
      updateView(`<h2>Page not found</h2>`);
  }
};

window.addEventListener("hashchange", router);

router();
