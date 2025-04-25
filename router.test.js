import { router, getHashParts } from "./app.js"; // app.js에서 router와 getHashParts를 import

jest.mock("./utils"); // getHashParts를 mock 처리할 수 있음

describe("router", () => {
  beforeEach(() => {
    global.location.hash = "";
  });

  test("should call newsFeeds when no route is provided", () => {
    // Mock getHashParts() ReturnValue check
    getHashParts.mockReturnValue({ type: undefined });

    // spy newsFeeds function call check
    const spy = jest.spyOn(global, "newsFeeds");

    router();

    expect(spy).toHaveBeenCalled();
  });

  test('should call newsDetail when type is "show"', () => {
    getHashParts.mockReturnValue({ type: "show", id: "1" });

    const spy = jest.spyOn(global, "newsDetail");

    router();

    expect(spy).toHaveBeenCalledWith("1");
  });

  test('should display "Page not found" for unknown route', () => {
    getHashParts.mockReturnValue({ type: "unknown", id: "1" });

    const container = document.getElementById("root");
    router();

    expect(container.innerHTML).toContain("<h2>Page not found</h2>");
  });
});
