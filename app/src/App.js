import { Fragment, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RevisionPage from "./pages/RevisionPage";
import CollectionDetailPage from "./pages/CollectionDetailPage";
import SignupPage from "./pages/SignupPage";
import { AuthContext } from "./store/auth-context";

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      {isLoggedIn && (
        <Fragment>
          <Route
            path="/collections/:collectionId"
            element={<CollectionDetailPage />}
          />
          <Route path="/revision/:collectionId" element={<RevisionPage />} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/" exact element={<HomePage />} />
        </Fragment>
      )}
      {!isLoggedIn && (
        <Fragment>
          <Route path="/signup" exact element={<SignupPage />} />
          <Route path="/login" exact element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Fragment>
      )}
    </Routes>
  );
}

export default App;
