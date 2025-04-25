import { NewsDetailApi} from '../core/api'
import { getHashParts, updateView, makeComment} from '../core/view'
import { CONTENT_URL } from '../config'

/**
 * Displays the details of a news item based on its ID.
 *
 * @returns {void} This function does not return anything.
 * @example
 * // To display the details of a news item with ID 123
 * newsDetail();
 *
 * To do: refactor -> class newsDetail{}
 */
export default async function newsDetail(): Promise<void> {
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
                <a href="#/page/${window.store.currentPage}" class="text-gray-500">
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
  
    for (let i = 0; i < window.store.feeds.length; i++) {
      if (window.store.feeds[i].id === Number(id)) {
        window.store.feeds[i].read = true;
        break;
      }
    }
  
    updateView(
      template.replace("{{__comments__}}", makeComment(newsContent.comments))
    );
  }
  