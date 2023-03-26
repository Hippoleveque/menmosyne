import React, { Fragment } from "react";
import { createRoot } from "react-dom/client";
import { act, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import EditCardModal from "../../../../components/CollectionDetail/EditCardModal/EditCardModal";

describe("EditCardModal", () => {
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
          <EditCardModal open={true} />
        </Fragment>
      );
    });
    expect(screen.getByTestId("edit-card-modal")).toBeInTheDocument();
  });

  // Modal content is not visible when the modal is closed
  it("Tests that the modal is not rendered when the modal is closed", () => {
    act(() => {
      root.render(
        <Fragment>
          <EditCardModal open={false} />
        </Fragment>
      );
    });
    expect(screen.queryByTestId("edit-card-modal")).not.toBeInTheDocument();
  });

  // Clicking on the confirm button triggers the correct api call and close the modal
  it("Tests that the card is updated and the modal closed when clicking on edit", async () => {
    const onClose = jest.fn();
    const mockedCard = {
      _id: "idTest",
      rectoContent: "rectoContentTest",
      versoContent: "versoContentTest",
    };

    act(() => {
      root.render(
        <Fragment>
          <EditCardModal open={true} onClose={onClose} card={mockedCard} />
        </Fragment>
      );
    });

    await act(async () => {
      screen
        .getByTestId("edit-card-button-from-modal")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `/api/cards/${mockedCard._id}/edit`,
      expect.objectContaining({
        method: "POST",
      })
    );
    expect(onClose).toHaveBeenCalled();
  });
});
