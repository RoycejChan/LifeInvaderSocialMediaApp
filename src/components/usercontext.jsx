import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();
//ALl components can acces the current local user
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const setUser = (user) => {
    setUserData(user);
  };

  return (
    <UserContext.Provider value={{ userData, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
