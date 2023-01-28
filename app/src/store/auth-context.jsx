import React, { useState, useEffect, useCallback } from "react";

export const AuthContext = React.createContext({
  isLoggedIn: false,
  loginToken: null,
});

let logoutTimer;

const retrieveTokenData = () => {
  const initialToken = localStorage.getItem("loginToken");
  const initialExpirationDate = localStorage.getItem("loginExpirationDate");
  const remainingTime = new Date(initialExpirationDate) - Date.now();
  if (remainingTime <= 3600 * 1000) {
    return null;
  }
  return {
    token: initialToken,
    initialExpirationDate,
  };
};

export const AuthContextProvider = (props) => {
  const [expirationDate, setExpirationDate] = useState();
  const [loginToken, setLoginToken] = useState();

  useEffect(() => {
    const tokenData = retrieveTokenData();
    if (tokenData) {
      setExpirationDate(tokenData.initialExpirationDate);
      setLoginToken(tokenData.token);
    }
  }, []);

  const logoutHandler = useCallback(() => {
    setLoginToken(null);
    clearTimeout(logoutTimer);
    localStorage.removeItem("loginToken");
    localStorage.removeItem("loginExpirationDate");
  }, []);

  useEffect(() => {
    if (expirationDate) {
      const remainingTime = new Date(expirationDate) - Date.now();
      logoutTimer = setTimeout(logoutHandler, remainingTime);
    }
  }, [expirationDate, logoutHandler]);

  const loginHandler = (token, expirationDate) => {
    clearTimeout(logoutTimer);
    setLoginToken(token);
    setExpirationDate(expirationDate);
    localStorage.setItem("loginToken", token);
    localStorage.setItem("loginExpirationDate", expirationDate);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: loginToken && true,
        loginToken: loginToken,
        onLogout: logoutHandler,
        onLogin: loginHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
