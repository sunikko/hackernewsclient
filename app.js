const container = document.getElementById("root");
const HEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

const store = {
  currentPage: 1,
};
const pageSize = 5;
///////////////////////////////////
// getData
///////////////////////////////////
function getData(url) {
  const ajax = new XMLHttpRequest();

  // to do : refactoring = migrate to fetch() with async/await
  ajax.open("GET", url, false);
  ajax.send();
  if (ajax.status === 200) {
    return JSON.parse(ajax.response);
  }
  throw new Error("Failed to load data");
}

////////////////////////////
// newscontent
////////////////////////////
function newsDetail() {
  const id = location.hash.substring(7); // to revove the '#'

  const newsContent = getData(CONTENT_URL.replace("@id", id));

  console.log(newsContent);

  container.innerHTML = `
    <h1>${newsContent.title}</h1>
    
    <div>
      <a href="#/page/${store.currentPage}">back</a>
    </div>
  `;
}

////////////////////////////
//news Feed
////////////////////////////
function newsFeeds() {
  const newsFeed = getData(HEWS_URL);
  const newsList = [];
  let tempplate = `
    <h1>Hacker News</h1>
    <ul>
      {{__news_feed__}}
    </ul>
    <div>
      <a href="#/page/{{__prev_page__}}">Previous</a>
      <a href="#/page/{{__next_page__}}">Next</a>
    </div>
  `;

  for (
    let i = (store.currentPage - 1) * pageSize;
    i < store.currentPage * pageSize && i < newsFeed.length;
    i++
  ) {
    if (!newsFeed[i]) continue;

    newsList.push(`
    <li>
      <a href="#/show/${newsFeed[i].id}">
        <strong>${newsFeed[i].title}</strong> ${newsFeed[i].comments_count}
      </a>
    </li>
    `);
  }
  tempplate = tempplate.replace("{{__news_feed__}}", newsList.join(""));
  tempplate = tempplate.replace(
    "{{__prev_page__}}",
    store.currentPage > 1 ? store.currentPage - 1 : 1
  );
  const totalPages = Math.ceil(newsFeed.length / pageSize);
  tempplate = tempplate.replace(
    "{{__next_page__}}",
    store.currentPage < totalPages ? store.currentPage + 1 : totalPages
  );
  container.innerHTML = tempplate;
}

function router() {
  const routePath = location.hash;
  if (routePath === "") {
    newsFeeds();
    return;
  } else if (routePath.indexOf("#/page/") >= 0) {
    const page = Number(routePath.substring(7));
    if (page < 1 || page > pageSize) {
      return;
    }
    store.currentPage = page;
    newsFeeds();
    return;
  } else if (routePath.indexOf("#/show/") >= 0) {
    newsDetail();
    return;
  }
}

window.addEventListener("hashchange", router);

router();
