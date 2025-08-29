// function getData(url) {
//   return new Promise((resolve, reject) => {
//     const ajax = new XMLHttpRequest();
//     ajax.open("GET", url, true);
//     ajax.onreadystatechange = function () {
//       if (ajax.readyState === 4) {
//         if (ajax.status === 200) {
//           resolve(JSON.parse(ajax.responseText));
//         } else {
//           reject(new Error("Failed to load data"));
//         }
//       }
//     };
//     ajax.send();
//   }
//   );
// }

// container.innerHTML = `
//     <h1>${newsContent.title}</h1>

//     <div>
//       <a href="#">back</a>
//     </div>
//   `;

// content.innerHTML = ""; // clear previous content
// const title = document.createElement("h1");
// title.innerHTML = newsContent.title;
// content.appendChild(title);

// for (let i = 0; i < newsFeed.length; i++) {
//   newsList.push(`
//     <li>
//       <a href="#${newsFeed[i].id}">
//         <strong>${newsFeed[i].title}</strong> ${newsFeed[i].comments_count}
//       </a>
//     </li>
//     `);

// const li = document.createElement("li");
// const a = document.createElement("a");
// a.href = `#${newsFeed[i].id}`; //newsFeed[i].url;
// a.innerHTML = `<strong>${newsFeed[i].title}</strong> ${newsFeed[i].comments_count}`;

// li.appendChild(a);
// ul.appendChild(li);
// }
// container.appendChild(ul);

// // 2 way
// container.innerHTML = `
//   <h1>Hacker News</h1>
//   <ul>
//     ${newsFeed.map((item) => `<li>${item.title}</li>`).join("")}
//   </ul>
// `;

// ajax.onreadystatechange = function () {
//   if (ajax.readyState === 4 && ajax.status === 200) {
//     const response = JSON.parse(ajax.responseText);
//     console.log(response);
//   }
// };

// const ajax = require('ajax-request');
// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const app = express();
// const port = 3000;
// const { exec } = require('child_process');
// const { spawn } = require('child_process');
// const { createServer } = require('http');
// const { Server } = require('socket.io');
// const server = createServer(app);
// const io = new Server(server);
// const { PythonShell } = require('python-shell');
// const cors = require('cors');
// const { v4: uuidv4 } = require('uuid');
// const { execSync } = require('child_process');
// const { Readable } = require('stream');
// const { Writable } = require('stream');
// const { Transform } = require('stream');
// const { pipeline } = require('stream');
// const { PassThrough } = require('stream');
// const { finished } = require('stream');
// const { ReadableStream } = require('stream/web');
// const { WritableStream } = require('stream/web');
// const { TransformStream } = require('stream/web');
// const { pipeline: webPipeline } = require('stream/web');
// const { PassThroughStream } = require('stream/web');
// const { finished: webFinished } = require('stream/web');
// const { ReadableStreamDefaultReader } = require('stream/web');
// const { WritableStreamDefaultWriter } = require('stream/web');
// const { TransformStreamDefaultController } = require('stream/web');
// const { ReadableStreamDefaultReader: WebReadableStreamDefaultReader } = require('stream/web');
// const { WritableStreamDefaultWriter: WebWritableStreamDefaultWriter } = require('stream/web');
// const { TransformStreamDefaultController: WebTransformStreamDefaultController } = require('stream/web');
// const { ReadableStreamDefaultWriter } = require('stream/web');
// const { WritableStreamDefaultReader } = require('stream/web');
// const { TransformStreamDefaultWriter } = require('stream/web');
// const { ReadableStreamDefaultController } = require('stream/web');
// const { WritableStreamDefaultController } = require('stream/web');
// const { TransformStreamDefaultReader } = require('stream/web');
// const { ReadableStreamDefaultWriter: WebReadableStreamDefaultWriter } = require('stream/web');
// const { WritableStreamDefaultWriter: WebWritableStreamDefaultWriter } = require('stream/web');
// const { TransformStreamDefaultReader: WebTransformStreamDefaultReader } = require('stream/web');

class Api {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  protected async request<T>(): Promise<T> {
    const response = await fetch(this.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${this.url}`);
    }
    return await response.json();
  }
}

// class NewsFeedApi extends Api {
//   async getData(): Promise<NewsFeed[]> {
//     return await this.request<NewsFeed[]>();
//   }
// }

// class NewsDetailApi extends Api {
//   async getData(): Promise<NewsDetail> {
//     return await this.request<NewsDetail>();
//   }
// }

// enum Color { red, Blue, Green} -> object 로 쓸 필요 있ㅣㅗ 하

// Color.Read;

// const Color = {
//     Red:1,
//     Blue:2,
//     Green:3
// };

// const colors =

// const [red, yello, black] = [1, 2, 3];

// }

// let o = {
//     isLoading: false,
// };

// let o2 = o;

// o2.isLoading = true;

// function doException() {
//     throw new Error('error');
// }

// try {
//     doException();
// }catch (e) {
// } finally {
//     // finally 블록은 try 블록이 성공하든 실패하든 항상 실행된다.
//     console.log('finally');
// }

// Handlebars
