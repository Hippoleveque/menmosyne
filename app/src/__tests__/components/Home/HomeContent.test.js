import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from "react-router-dom";

import HomeContent from "../../../components/Home/HomeContent";

describe("HomeContent", () => {
  let container = null;

  const mockedUsedNavigate = jest.fn();

  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it("Tests the Welcome message is rendered", () => {
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => mockedUsedNavigate,
    }));

    act(() => {
      render(
        <Router>
          <HomeContent />
        </Router>,
        container
      );
    });
    expect(
      container.querySelector("[data-testid='welcome-message']").textContent
    ).toBe("Bon retour !");
  });
});
