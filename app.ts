
import router from './src/core/router'
import Store from './src/store'


const store = new Store();

router(store);
window.addEventListener("hashchange", () => router(store));  
