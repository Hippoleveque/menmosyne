import React, { useState, useEffect, useCallback } from "react";

export const AuthContext = React.createContext({
  isLoggedIn: false,
  loginToken: null,
});

let logoutTimer;

export const AuthContextProvider = (props) => {
  const [loginToken, setLoginToken] = useState(null);
  const [expirationDate, setExpirationDate] = useState(null);

  const logoutHandler = useCallback(() => {
    setLoginToken(null);
    clearTimeout(logoutTimer);
  }, []);

  const loginHandler = (token, expirationDate) => {
    clearTimeout(logoutTimer);
    setLoginToken(token);
    setExpirationDate(expirationDate);
  };

  useEffect(() => {
    if (expirationDate) {
      const remainingTime = expirationDate - Date.now();
      console.log(remainingTime);
      logoutTimer = setTimeout(logoutHandler, remainingTime);
    }
  }, [expirationDate, logoutHandler]);

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
