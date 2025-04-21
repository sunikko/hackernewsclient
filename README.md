# 📰 Hacker News Clone (Vanilla JS → TypeScript)

A minimal Hacker News clone built with **vanilla JavaScript**, progressively upgraded to **TypeScript** for type safety and maintainability. The app features basic routing, API integration, comment threads, pagination, and dynamic UI updates, all styled with **Tailwind CSS**.

---

## 🚀 Features

- 📄 **News Feed & Detail View**  
  Fetches top stories from the Hacker News API and renders news detail with recursive comments.

- 🔗 **Client-side Routing**  
  Lightweight hash-based routing (`#page=n`, `#id=123`) to navigate between views.

- 🧭 **Pagination Support**  
  Supports page-based navigation of the news feed.

- ✅ **Read Tracking**  
  Items marked as read are visually distinguished for better UX.

- 💨 **Optimized Feed Caching**  
  Feeds are memoized in the store to avoid redundant API calls.

- 🎨 **Tailwind CSS Integration**  
  Clean, responsive layout powered by utility-first styling.

- 🔧 **TypeScript Migration (WIP)**  
  Gradually migrating from JavaScript to TypeScript for improved type safety.

- 🧪 **Testing Setup with Jest**  
  Basic configuration for unit testing and documentation using JSDoc.

---

## 🛠️ Tech Stack

- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Jest](https://jestjs.io/)
- [Hacker News API](https://github.com/HackerNews/API)

---

## 📂 Project Structure (in progress)

    src/
    ├── app.ts              # App entry point
    ├── index.html          # App entry point


    src/
    ├── types/              # TypeScript type definitions
    ├── views/              # View functions (newsFeed, newsDetail)
    ├── templates/          # HTML templates with Tailwind classes
    ├── utils/              # Helper functions (e.g., router, fetch logic)
    ├── app.ts              # App entry point
    ├── store.ts            # Shared store with reactive state
    ├── main.css            # Tailwind directives

---

## 🧰 Getting Started

### 1. Clone the repository

    git clone https://github.com/your-username/hacker-news-clone.git
    cd hacker-news-clone

### 2. Install dependencies

    npm install

### 3. Run development server

    npm run dev

### 4. Build for production

    npm run build

---

## ✅ Roadmap

- [x] Basic view rendering with vanilla JS
- [x] Add routing and pagination
- [x] Add Tailwind styling
- [x] Integrate read/unread state
- [x] Refactor with template literals
- [x] Replace XMLHttpRequest with fetch API
- [x] Set up TypeScript environment
- [x] Add type annotations for feeds and comments
- [ ] Implement reactive state/store logic
- [ ] Improve accessibility and UX
- [ ] Add unit tests for core logic
- [ ] Migrate all JS files to TS

---
