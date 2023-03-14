import React from "react";
import { createRoot } from "react-dom/client";
import { act, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import * as router from "react-router";

import LoginContent from "../../../components/Login/LoginContent";

describe("LoginContent", () => {
  let container = null;
  let root = null;

  const mockedNavigate = jest.fn();

  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    jest.restoreAllMocks();
    global.fetch = jest.fn(() => {
      return Promise.resolve({
        status: 200,
        ok: true,
        json: () =>
          Promise.resolve({
            token: "testToken",
            expirationDate: new Date().getTime() + 1000,
          }),
      });
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

  // Test that the fields and button are rendered
  it("Test that the fields and button are rendered", () => {
    act(() => {
      root.render(
        <Router>
          <LoginContent />
        </Router>
      );
    });
    expect(screen.getByTestId("email-field-login")).toBeInTheDocument();
    expect(screen.getByTestId("password-field-login")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button-login")).toBeInTheDocument();
    expect(screen.getByTestId("signup-button-login")).toBeInTheDocument();
  });

  // Test that an api POST is made when the form is submitted
  it("Test that an api POST is made when the form is submitted", async () => {
    await act(async () => {
      root.render(
        <Router>
          <LoginContent />
        </Router>
      );
    });

    await act(async () => {
      screen
        .getByTestId("submit-button-login")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
      })
    );
    // TO DO : ajouter un test sur useNavigate
  });
});
