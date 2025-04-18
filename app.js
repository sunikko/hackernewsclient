const container = document.getElementById("root");
const HEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

///////////////////////////////////
// getData
///////////////////////////////////
function getData(url) {
  const ajax = new XMLHttpRequest();
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
  const id = location.hash.substring(1); // to revove the '#'

  const newsContent = getData(CONTENT_URL.replace("@id", id));

  console.log(newsContent);

  container.innerHTML = `
    <h1>${newsContent.title}</h1>
    
    <div>
      <a href="#">back</a>
    </div>
  `;
}

////////////////////////////
//news Feed
////////////////////////////
function newsFeeds() {
  const newsFeed = getData(HEWS_URL);
  const newsList = [];

  newsList.push("<ul>");
  for (let i = 0; i < newsFeed.length; i++) {
    newsList.push(`
    <li>
      <a href="#${newsFeed[i].id}">
        <strong>${newsFeed[i].title}</strong> ${newsFeed[i].comments_count}
      </a>
    </li>
    `);
  }
  newsList.push("</ul>");
  container.innerHTML = newsList.join("");
}

function router() {
  const routePath = location.hash;
  if (routePath === "") {
    newsFeeds();
    return;
  } else {
    newsDetail();
    return;
  }
}

window.addEventListener("hashchange", router);

router();
