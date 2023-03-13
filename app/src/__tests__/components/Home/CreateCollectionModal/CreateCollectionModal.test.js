import React, { Fragment } from "react";
import { createRoot } from "react-dom/client";
import { act, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import CreateCollectionModal from "../../../../components/Home/CreateCollectionModal/CreateCollectionModal";

describe("CreateCollectionModal", () => {
  let container = null;
  let root = null;

  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    jest.restoreAllMocks();
    global.fetch = jest.fn(() => Promise.resolve({ status: 200, ok: true }));
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

  // Modal content is visible when the modal is open
  it("Tests that the modal renders correctly when opened", () => {
    act(() => {
      root.render(
        <Fragment>
          <CreateCollectionModal open={true} />
        </Fragment>
      );
    });
    expect(screen.getByTestId("create-collection-modal")).toBeInTheDocument();
  });

  // Modal content is not visible when the modal is closed
  it("Tests that the modal is not rendered when the modal is closed", () => {
    act(() => {
      root.render(
        <Fragment>
          <CreateCollectionModal open={false} />
        </Fragment>
      );
    });
    expect(
      screen.queryByTestId("create-collection-modal")
    ).not.toBeInTheDocument();
  });

  // Clicking on the confirm button triggers the correct api call and close the modal
  it("Tests that the collection is deleted and the modal closed when clicking on confirm", async () => {
    const onClose = jest.fn();

    act(() => {
      root.render(
        <Fragment>
          <CreateCollectionModal open={true} onClose={onClose} />
        </Fragment>
      );
    });

    await act(async () => {
      screen
        .getByTestId("create-collection-button-from-modal")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/memo/cardCollections",
      expect.objectContaining({
        method: "POST",
      })
    );
    expect(onClose).toHaveBeenCalled();
  });

  // TBD : tests that the error message is displayed when the api call fails
});
