import { NewsFeed, NewsDetail} from '../types'

// Base API class for making HTTP requests
export class Api {
    async getRequest<T>(url: string): Promise<T> {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return (await response.json()) as T;
    }
  }
  
export class NewsFeedApi {
    async getData(url: string): Promise<NewsFeed[]> {
      // getRequest is provided via mixin from Api
      return await this.getRequest<NewsFeed[]>(url);
    }
  }
  
export class NewsDetailApi {
    async getData(url: string): Promise<NewsDetail> {
      // getRequest is provided via mixin from Api
      return await this.getRequest<NewsDetail>(url);
    }
  }
  
  // Extend the interfaces so TypeScript recognizes the mixed-in methods
  export interface NewsFeedApi extends Api {}
  export interface NewsDetailApi extends Api {}
  
  // Apply mixins to inject methods from Api into the specific API classes
  applyApiMixins(NewsFeedApi, [Api]);
  applyApiMixins(NewsDetailApi, [Api]);


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
  
  