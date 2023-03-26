import React, { Fragment } from "react";
import { createRoot } from "react-dom/client";
import { act, screen, waitFor } from "@testing-library/react";
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
      "/api/collections/0/cards-to-review",
      expect.objectContaining({
        method: "GET",
      })
    );
  });

  // Test initial session creation
  it("Tests initial session creation", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            session: { collectionId: "0", date: new Date(), _id: "0" },
          }),
      })
    );
    await act(async () => {
      root.render(
        <Router>
          <RevisionContent collectionId="0" />
        </Router>
      );
    });
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/sessions",
      expect.objectContaining({
        method: "POST",
      })
    );
    global.fetch.mockRestore();
  });

  // Test that the cards are refetched when needed
  it("Tests card re-fetching", async () => {
    global.fetch = jest.fn((url, _) => {
      if (url === "/api/collections/0/cards-to-review") {
        return Promise.resolve({
          status: 200,
          json: () =>
            Promise.resolve({
              cards: [
                {
                  _id: "0",
                  rectoContent: "1",
                  versoContent: "1",
                },
              ],
              totalCards: 1,
            }),
        });
      } else if (url === "/api/sessions") {
        return Promise.resolve({
          status: 200,
          json: () =>
            Promise.resolve({
              dailySession: { collectionId: "0", date: new Date(), _id: "0" },
            }),
        });
      } else if (url === "/api/cards/0/review") {
        return Promise.resolve({
          status: 200,
          json: () => Promise.resolve({}),
        });
      } else {
        return Promise.resolve({
          status: 200,
          json: () => Promise.resolve({}),
        });
      }
    });

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

    await waitFor(async () => expect(global.fetch).toHaveBeenCalledTimes(3));
  });

  // Test that the cards are reviewed again when bad answer
  it("Tests card re-reviewing and api call to review endpoint", async () => {
    global.fetch = jest.fn((url, _) => {
      if (url === "/api/collections/0/cards-to-review") {
        return Promise.resolve({
          status: 200,
          json: () =>
            Promise.resolve({
              cards: [
                {
                  _id: "0",
                  rectoContent: "1",
                  versoContent: "1",
                },
              ],
              totalCards: 1,
            }),
        });
      } else if (url === "/api/sessions") {
        return Promise.resolve({
          status: 200,
          json: () =>
            Promise.resolve({
              dailySession: { collectionId: "0", date: new Date(), _id: "0" },
            }),
        });
      } else if (url === "/api/cards/0/review") {
        return Promise.resolve({
          status: 200,
          json: () => Promise.resolve({}),
        });
      } else {
        return Promise.resolve({
          status: 200,
          json: () => Promise.resolve({}),
        });
      }
    });

    await act(async () => {
      root.render(
        <Router>
          <RevisionContent collectionId="0" />
        </Router>
      );
    });

    await waitFor(async () => expect(global.fetch).toHaveBeenCalledTimes(2));

    act(() => {
      screen
        .getByTestId("display-verso-revision-button-0")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    await act(async () => {
      screen
        .getByTestId("set-hard-button-revision-0")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/cards/0/review",
      expect.objectContaining({
        method: "POST",
      })
    );
    expect(screen.getByTestId("recto-revision-card-0")).toBeInTheDocument();
    expect(
      screen.queryByTestId("verso-revision-card-0")
    ).not.toBeInTheDocument();
  });

  // TBD : Test navigating back to / when there are no more cards
});
