import React from "react";
import { createRoot } from "react-dom/client";
import { act, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import ImportContent from "../../../components/Import/ImportContent";

describe("ImportContent", () => {
  let container = null;
  let root = null;

  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    jest.restoreAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ data: [] }) })
    );
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

  // Test that we can upload a file to the backend
  it("Test that the fields and button are rendered", async () => {
    const file = new File(["test"], "test.apkg");

    act(() => {
      root.render(
        <Router>
          <ImportContent />
        </Router>
      );
    });
    const uploader = screen.getByTestId("upload-file-button-import");
    userEvent.upload(uploader, file);
    await waitFor(async () =>
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/import/import",
        expect.objectContaining({
          method: "POST",
        })
      )
    );
  });
});
