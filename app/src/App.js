// import { useContext } from "react";
import { Routes, Route } from "react-router-dom";


import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RevisionPage from "./pages/RevisionPage"
// import { AuthContext } from "./store/auth-context";

function App() {
  // const { loginToken, isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" exact element={<LoginPage />} />
      <Route path="/" exact element={<HomePage />} />
      <Route path="/revision" exact element={<RevisionPage />} />
    </Routes>
  );
}

export default App;
