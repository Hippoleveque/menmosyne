import React from "react";
import { createRoot } from "react-dom/client";
import { act, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import * as ReactRedux from "react-redux";
import * as router from "react-router";
import configureStore from "redux-mock-store";

import SideMenuLayout from "../../../components/Layouts/SideMenuLayout";

const mockStore = configureStore([]);
const Provider = ReactRedux.Provider;

const mockedDispatch = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockedDispatch,
}));

describe("SideMenuLayout", () => {
  let container = null;
  let root = null;
  let store = null;

  const mockedNavigate = jest.fn();
  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    jest.restoreAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ user: { email: "test@test.com" } }),
      })
    );
    store = mockStore({ auth: { user: null } });
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

  // Test that all elements in the menu are rendered
  it("Tests that all items in the menu and the avatar are rendered", () => {
    act(() => {
      root.render(
        <Provider store={store}>
          <Router>
            <SideMenuLayout />
          </Router>
        </Provider>
      );
    });

    expect(screen.getByTestId("side-menu-item-Home")).toBeInTheDocument();
    expect(screen.getByTestId("side-menu-item-Import")).toBeInTheDocument();
    expect(screen.getByTestId("side-menu-avatar")).toBeInTheDocument();
    expect(screen.getByTestId("side-menu-logo")).toBeInTheDocument();
  });

  // Test that the user is updated correctly within redux
  it("Tests that the user is updated correctly within redux", async () => {
    await act(async () => {
      root.render(
        <Provider store={store}>
          <Router>
            <SideMenuLayout />
          </Router>
        </Provider>
      );
    });

    expect(mockedDispatch).toHaveBeenCalled();
  });

  // Test that cliking on the home item menu navigates to the home page
  it("Tests that clicking on the home item menu navigates to the home page", () => {
    act(() => {
      root.render(
        <Provider store={store}>
          <Router>
            <SideMenuLayout />
          </Router>
        </Provider>
      );
    });

    act(() => {
      screen
        .getByTestId("side-menu-item-Home")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(mockedNavigate).toHaveBeenCalledWith("/");
  });

  // Test that cliking on the import item menu navigates to the import page
  it("Tests that clicking on the home item menu navigates to the import page", () => {
    act(() => {
      root.render(
        <Provider store={store}>
          <Router>
            <SideMenuLayout />
          </Router>
        </Provider>
      );
    });

    act(() => {
      screen
        .getByTestId("side-menu-item-Import")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(mockedNavigate).toHaveBeenCalledWith("/import");
  });
});
