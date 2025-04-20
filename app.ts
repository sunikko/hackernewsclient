type Store = {
  currentPage: number;
  feeds: NewsFeed[];
};

type NewsFeed = {
  id: number;
  comments_count: number;
  url: string;
  user: string;
  time_ago: string;
  points: number;
  title: string;
  read?: boolean;
};

const container: HTMLElement | null = document.getElementById("root");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

const store: Store = {
  currentPage: 1,
  feeds: [],
};
const pageSize = 5;

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
async function getData(url) {
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
function updateView(html) {
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
async function newsDetail() {
  const { id } = getHashParts();
  if (!id) {
    return;
  }

  const newsContent = await getData(CONTENT_URL.replace("@id", id));

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

  function makeComment(comments, called = 0) {
    const commentString = [];

    for (let i = 0; i < comments.length; i++) {
      commentString.push(`
        <div style="padding-left: ${called * 40}px;" class="mt-4">
          <div class="text-gray-400">
            <i class="fa fa-sort-up mr-2"></i>
            <strong>${comments[i].user}</strong> ${comments[i].time_ago}
          </div>
          <p class="text-gray-700">${comments[i].content}</p>
        </div>      
      `);

      if (comments[i].comments.length > 0) {
        commentString.push(makeComment(comments[i].comments, called + 1));
      }
    }

    return commentString.join("");
  }

  updateView(
    template.replace("{{__comments__}}", makeComment(newsContent.comments))
  );
}

function makeFeeds(feeds) {
  const newsFeed = [];
  for (let i = 0; i < feeds.length; i++) {
    newsFeed.push({
      id: feeds[i].id,
      title: feeds[i].title,
      user: feeds[i].user,
      points: feeds[i].points,
      time_ago: feeds[i].time_ago,
      comments_count: feeds[i].comments_count,
      read: false,
    });
  }
  return newsFeed;
}

function createNewsItem(newsFeed) {
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

function getHeaderTemplate() {
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
async function newsFeeds() {
  let newsFeed = store.feeds;
  const newsList = [];
  let template = `
     <div class="bg-gray-600 min-h-screen">
      ${getHeaderTemplate()}
      <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}        
      </div>
    </div>
  `;

  if (newsFeed.length === 0) {
    newsFeed = store.feeds = makeFeeds(await getData(NEWS_URL));
  }

  for (
    let i = (store.currentPage - 1) * pageSize;
    i < store.currentPage * pageSize && i < newsFeed.length;
    i++
  ) {
    if (!newsFeed[i]) continue;
    newsList.push(createNewsItem(newsFeed[i]));
  }
  template = template.replace("{{__news_feed__}}", newsList.join(""));
  template = template.replace(
    "{{__prev_page__}}",
    store.currentPage > 1 ? store.currentPage - 1 : 1
  );
  const totalPages = Math.ceil(newsFeed.length / pageSize);
  template = template.replace(
    "{{__next_page__}}",
    store.currentPage < totalPages ? store.currentPage + 1 : totalPages
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
export const router = () => {
  const { type, id } = getHashParts();

  switch (type) {
    case undefined:
      return newsFeeds();
    case "page":
      const page = Number(id);
      if (!page || page < 1 || page > pageSize || isNaN(page)) return;
      store.currentPage = page;
      return newsFeeds();
    case "show":
      return newsDetail();
    default:
      updateView(`<h2>Page not found</h2>`);
  }
};

window.addEventListener("hashchange", router);

router();
