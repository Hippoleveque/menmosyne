import React, { Fragment } from "react";
import { createRoot } from "react-dom/client";
import { act, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";

import RevisionContent from "../../../components/Revision/RevisionContent";

describe("RevisionContent", () => {
  let container = null;
  let root = null;

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
            cards: [
              {
                _id: offset.toString(),
                rectoContent: `Recto ${offset}`,
                versoContent: `Verso ${offset}`,
                title: `Title ${offset}`,
              },
            ],
            totalCards: 30,
          }),
      });
    });
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

  // Test initial fetching
  it("Tests initial card fetching", async () => {
    await act(async () => {
      root.render(
        <Router>
          <RevisionContent collectionId="0" />
        </Router>
      );
    });
    expect(screen.getByTestId("revision-card-0")).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/memo/cards/0?offset=0&limit=10",
      expect.objectContaining({
        method: "GET",
      })
    );
  });

  // Test that the cards are refetched when needed
  it("Tests card re-fetching", async () => {
    await act(async () => {
      root.render(
        <Router>
          <RevisionContent collectionId="0" />
        </Router>
      );
    });

    act(() => {
      screen
        .getByTestId("display-verso-revision-button-0")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    await act(async () => {
      screen
        .getByTestId("set-easy-button-revision-0")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/memo/cards/0?offset=10&limit=10",
      expect.objectContaining({
        method: "GET",
      })
    );
  });

  // TBD : Test navigating back to / when there are no more cards
});