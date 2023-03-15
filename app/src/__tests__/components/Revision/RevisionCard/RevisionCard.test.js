import React, { Fragment } from "react";
import { createRoot } from "react-dom/client";
import { act, screen } from "@testing-library/react";
// import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";

import RevisionCard from "../../../../components/Revision/RevisionCard/RevisionCard";

describe("RevisionContent", () => {
  let container = null;
  let root = null;

  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    jest.restoreAllMocks();
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

  // Test original recto position
  it("Tests initial recto position", () => {
    act(() => {
      root.render(
        <Fragment>
          <RevisionCard
            card={{
              _id: "0",
              title: "title0",
              rectoContent: "rectoContent0",
              versoContent: "versoContent0",
            }}
          />
        </Fragment>
      );
    });
    expect(screen.getByTestId("revision-card-0")).toBeInTheDocument();
    expect(screen.getByTestId("title-revision-card-0").textContent).toBe(
      "title0"
    );
    expect(screen.getByTestId("recto-revision-card-0").textContent).toBe(
      "rectoContent0"
    );
  });

  // Test verso position
  it("Tests verso position", () => {
    const handleActionClick = jest.fn();

    act(() => {
      root.render(
        <Fragment>
          <RevisionCard
            card={{
              _id: "0",
              title: "title0",
              rectoContent: "rectoContent0",
              versoContent: "versoContent0",
            }}
            handleActionClick={handleActionClick}
          />
        </Fragment>
      );
    });

    act(() => {
      screen
        .getByTestId("display-verso-revision-button-0")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(screen.getByTestId("verso-revision-card-0").textContent).toBe(
      "versoContent0"
    );

    act(() => {
      screen
        .getByTestId("set-easy-button-revision-0")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(handleActionClick).toHaveBeenCalled();
  });
});
