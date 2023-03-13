import React, { Fragment } from "react";
import { createRoot } from "react-dom/client";
import { act, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import ConfirmCollectionDeletionModal from "../../../../components/Home/ConfirmCollectionDeletionModal/ConfirmCollectionDeletionModal";

describe("ConfirmCollectionDeletionModal", () => {
  let container = null;
  let root = null;

  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    jest.restoreAllMocks();
    global.fetch = jest.fn();
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
          <ConfirmCollectionDeletionModal collectionId="0" open={true} />
        </Fragment>
      );
    });
    expect(screen.getByTestId("delete-collection-modal")).toBeInTheDocument();
  });

  // Modal content is not visible when the modal is closed
  it("Tests that the modal is not rendered when the modal is closed", () => {
    act(() => {
      root.render(
        <Fragment>
          <ConfirmCollectionDeletionModal collectionId="0" open={false} />
        </Fragment>
      );
    });
    expect(
      screen.queryByTestId("delete-collection-modal")
    ).not.toBeInTheDocument();
  });

  // On close function is called when we click on the cancel button
  it("Tests that the onClose function is called when we click on the close button", () => {
    const onClose = jest.fn();

    act(() => {
      root.render(
        <Fragment>
          <ConfirmCollectionDeletionModal
            collectionId="0"
            open={true}
            onClose={onClose}
          />
        </Fragment>
      );
    });

    act(() => {
      screen
        .getByTestId("cancel-delete-collection-button")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onClose).toHaveBeenCalled();
  });

  // Clicking on the confirm button triggers the correct api call and close the modal
  it("Tests that the collection is deleted and the modal closed when clicking on confirm", async () => {
    const onClose = jest.fn();

    act(() => {
      root.render(
        <Fragment>
          <ConfirmCollectionDeletionModal
            collectionId="0"
            open={true}
            onClose={onClose}
          />
        </Fragment>
      );
    });

    await act(async () => {
      screen
        .getByTestId("confirm-delete-collection-button")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/memo/cardCollections/0",
      expect.objectContaining({
        method: "DELETE",
      })
    );
    expect(onClose).toHaveBeenCalled();
  });
});
