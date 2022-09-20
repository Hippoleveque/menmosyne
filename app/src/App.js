import { useContext } from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
// import { AuthContext } from "./store/auth-context";

function App() {
  // const { loginToken } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" exact element={<LoginPage />} />
      <Route path="/" exact element={<HomePage />} />
    </Routes>
  );
}

export default App;
