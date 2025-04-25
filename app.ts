
import router from './src/core/router'
import {Store} from './src/types'

const store: Store = {
  currentPage: 1,
  feeds: [],
  pageSize: 5
};

// [to do] : not use global variable
declare global {
  interface Window {
    store: Store;
  }
}
window.store = store;

window.addEventListener("hashchange", router);  
router();
  