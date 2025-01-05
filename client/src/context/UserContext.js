import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => ({
    username: localStorage.getItem("username"),
    room: localStorage.getItem("room"),
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
  }));

  const login = (userData) => {
    localStorage.setItem("username", userData.username);
    localStorage.setItem("room", userData.room);
    localStorage.setItem("token", userData.token);
    setUser({
      username: userData.username,
      room: userData.room,
      token: userData.token,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser({
      username: null,
      room: null,
      token: null,
      isAuthenticated: false,
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
