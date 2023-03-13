import React from "react";
import { createRoot } from "react-dom/client";
import { act, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import * as router from "react-router";

import HomeContent from "../../../components/Home/HomeContent";

describe("HomeContent", () => {
  let container = null;
  let root = null;

  const mockedNavigate = jest.fn();

  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    jest.restoreAllMocks();
    global.fetch = jest.fn((url, _) => {
      const search = url.split("?")[1];
      const urlParams = new URLSearchParams(search);
      const offset = parseInt(urlParams.get("offset")) || 0;
      return Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            cardCollections: [
              { _id: offset.toString(), name: `Collection ${offset}` },
              {
                _id: (offset + 1).toString(),
                name: `Collection ${offset + 1}`,
              },
            ],
            totalCollections: 30,
          }),
      });
    });
    jest.spyOn(router, "useNavigate").mockImplementation(() => mockedNavigate);
  });

  afterEach(() => {
    // cleanup on exiting
    act(() => {
      root.unmount();
    });
    container.remove();
    container = null;
    root = null;
  });

  // Test fetching the collections
  it("Test the collections are fetched correctly", async () => {
    await act(async () => {
      root.render(
        <Router>
          <HomeContent />
        </Router>
      );
    });

    expect(screen.getByTestId("collection-0").textContent).toBe("Collection 0");
    expect(screen.getByTestId("collection-1").textContent).toBe("Collection 1");

    // When changing the page
    await act(async () => {
      screen
        .getByText("2")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    await waitFor(async () => expect(global.fetch).toHaveBeenCalledTimes(2));

    expect(screen.getByTestId("collection-7").textContent).toBe("Collection 7");
    expect(screen.getByTestId("collection-8").textContent).toBe("Collection 8");
  });

  it("Tests the Welcome message is rendered", async () => {
    await act(async () => {
      root.render(
        <Router>
          <HomeContent />
        </Router>
      );
    });
    expect(screen.getByTestId("welcome-message").textContent).toBe(
      "Bon retour !"
    );
  });

  // Test click adding a collection button
  it("Tests that clicking the collection button open the modal", async () => {
    await act(async () => {
      root.render(
        <Router>
          <HomeContent />
        </Router>
      );
    });

    await act(async () => {
      screen
        .getByTestId("create-collection-button")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(screen.getByTestId("create-collection-modal")).toBeInTheDocument();
  });

  // Test the "réviser" button
  it("Tests clicking the review button", async () => {
    await act(async () => {
      root.render(
        <Router>
          <HomeContent />
        </Router>
      );
    });

    act(() => {
      screen
        .getByTestId("review-button-0")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
  });

  // Test the "supprimer" button
  it("Tests clicking the delete button", async () => {
    await act(async () => {
      root.render(
        <Router>
          <HomeContent />
        </Router>
      );
    });

    await act(async () => {
      screen
        .getByTestId("delete-collection-0")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(screen.getByTestId("delete-collection-modal")).toBeInTheDocument();
  });
});
