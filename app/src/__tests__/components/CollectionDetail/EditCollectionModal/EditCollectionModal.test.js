import React, { Fragment } from "react";
import { createRoot } from "react-dom/client";
import { act, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import EditCollectiondModal from "../../../../components/CollectionDetail/EditCollectionModal/EditCollectionModal";

describe("EditCollectionModal", () => {
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
    const mockedCollection = {
      _id: "testCollection",
      reviewPolicy: {
        newCardsPerDay: 10,
        reviewCardsPerDay: 10,
      },
    };
    act(() => {
      root.render(
        <Fragment>
          <EditCollectiondModal open={true} collection={mockedCollection} />
        </Fragment>
      );
    });
    expect(screen.getByTestId("edit-collection-modal")).toBeInTheDocument();
  });

  // Modal content is not visible when the modal is closed
  it("Tests that the modal is not rendered when the modal is closed", () => {
    const mockedCollection = {
      _id: "testCollection",
      reviewPolicy: {
        newCardsPerDay: 10,
        reviewCardsPerDay: 10,
      },
    };
    act(() => {
      root.render(
        <Fragment>
          <EditCollectiondModal open={false} collection={mockedCollection} />
        </Fragment>
      );
    });
    expect(
      screen.queryByTestId("edit-collection-modal")
    ).not.toBeInTheDocument();
  });

  // Clicking on the confirm button triggers the correct api call and close the modal
  it("Tests that the collection is updated and the modal closed when clicking on edit", async () => {
    const onClose = jest.fn();
    const mockedCollection = {
      _id: "testCollection",
      reviewPolicy: {
        newCardsPerDay: 10,
        reviewCardsPerDay: 10,
      },
    };
    act(() => {
      root.render(
        <Fragment>
          <EditCollectiondModal
            open={true}
            collection={mockedCollection}
            onClose={onClose}
          />
        </Fragment>
      );
    });

    await act(async () => {
      screen
        .getByTestId("edit-collection-button-from-modal")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `/api/collections/${mockedCollection._id}/edit`,
      expect.objectContaining({
        method: "POST",
      })
    );
  });
});
