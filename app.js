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

function getHashParts() {
  const [, type, id] = location.hash.split("/");
  return { type, id };
}

////////////////////////////
// newscontent
////////////////////////////
function newsDetail() {
  const { id } = getHashParts();
  if (!id) {
    return;
  }

  const newsContent = getData(CONTENT_URL.replace("@id", id));

  console.log(newsContent);

  function makeComment(comments, called = 0) {
    const commentString = [];

    for (let i = 0; i < comments.length; i++) {
      commentString.push(`
        <div style="padding-left: ${called * 40}px;">
          <div>
            <strong>${comments[i].user}</strong> ${comments[i].time_ago}
          </div>
          <p>${comments[i].content}</p>
        </div>      
      `);

      if (comments[i].comments.length > 0) {
        commentString.push(makeComment(comments[i].comments, called + 1));
      }
    }

    return commentString.join("");
  }

  const commentString = makeComment(newsContent.comments);

  container.innerHTML = `
    <h1>${newsContent.title}</h1>
    <div>
      <div>
        <strong>${newsContent.user}</strong> ${newsContent.time_ago}  
      </div>
      <p>${newsContent.content}</p>
    </div>
    <div>
      <h2>Comments</h2>
      ${commentString} 
    </div>

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
  let template = `
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
  container.innerHTML = template;
}

function router() {
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
      container.innerHTML = `<h2>Page not found</h2>`;
  }
}

window.addEventListener("hashchange", router);

router();
