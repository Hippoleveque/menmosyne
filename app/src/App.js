import { Fragment, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RevisionPage from "./pages/RevisionPage";
import { AuthContext } from "./store/auth-context";

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      {isLoggedIn && (
        <Fragment>
          <Route path="/" exact element={<HomePage />} />
          <Route path="/revision" exact element={<RevisionPage />} />{" "}
        </Fragment>
      )}
      {!isLoggedIn && (
        <Fragment>
          <Route path="/login" exact element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Fragment>
      )}
    </Routes>
  );
}

export default App;
