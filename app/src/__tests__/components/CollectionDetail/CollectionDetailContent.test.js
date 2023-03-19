import React from "react";
import { createRoot } from "react-dom/client";
import { act, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import * as router from "react-router";

import CollectionDetailContent from "../../../components/CollectionDetail/CollectionDetailContent";

describe("CollectionDetailContent", () => {
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
      if (url.startsWith("/api/collections/0/cards")) {
        const search = url.split("?")[1];
        const urlParams = new URLSearchParams(search);
        const offset = parseInt(urlParams.get("offset")) || 0;
        return Promise.resolve({
          status: 200,
          json: () =>
            Promise.resolve({
              cards: [
                {
                  _id: offset.toString(),
                  rectoContent: `Recto ${offset}`,
                  versoContent: `Verso ${offset}`,
                },
                {
                  _id: (offset + 1).toString(),
                  rectoContent: `Recto ${offset + 1}`,
                  versoContent: `Verso ${offset + 1}`,
                },
              ],
              totalCards: 30,
            }),
        });
      } else {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              cardCollection: { name: "Collection 0" },
            }),
        });
      }
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

  // Test fetching the collection we are looking at
  it("Tests the collection has been fetched correctly", async () => {
    await act(async () => {
      root.render(
        <Router>
          <CollectionDetailContent collectionId="0"/>
        </Router>
      );
    });

    expect(screen.getByTestId("collection-detail-name").textContent).toBe(
      "Collection 0"
    );
    global.fetch.mockRestore();
  });

  // Test fetching the cards
  it("Tests the cards are fetched correctly", async () => {
    await act(async () => {
      root.render(
        <Router>
          <CollectionDetailContent collectionId="0"/>
        </Router>
      );
    });

    expect(screen.getByTestId("card-0")).toBeInTheDocument();
    expect(screen.getByTestId("card-1")).toBeInTheDocument();

    // When changing the page
    await act(async () => {
      screen
        .getByText("2")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    await waitFor(async () => expect(global.fetch).toHaveBeenCalledTimes(3));
    
    expect(screen.getByTestId("card-7")).toBeInTheDocument();
    expect(screen.getByTestId("card-8")).toBeInTheDocument();
  });

    // Test click adding a card button
    it("Tests that clicking adding a card button open the modal", async () => {
      await act(async () => {
        root.render(
          <Router>
            <CollectionDetailContent collectionId="0"/>
          </Router>
        );
      });

      act(() => {
        screen
          .getByTestId("create-card-button")
          .dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
      expect(screen.getByTestId("create-card-modal")).toBeInTheDocument();
    });

    // Test the "réviser" button
    it("Tests clicking the review button", async () => {
      await act(async () => {
        root.render(
          <Router>
            <CollectionDetailContent collectionId="0"/>
          </Router>
        );
      });

      act(() => {
        screen
          .getByTestId("review-button-collection-detail")
          .dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });

      expect(mockedNavigate).toHaveBeenCalledWith("/revision/0");
    });

    // Test the "supprimer" button
    it("Tests clicking the delete button", async () => {
      await act(async () => {
        root.render(
          <Router>
            <CollectionDetailContent collectionId="0"/>
          </Router>
        );
      });

      await act(async () => {
        screen
          .getByTestId("delete-card-button-0")
          .dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });

      expect(screen.getByTestId("delete-card-modal")).toBeInTheDocument();
    });
});
