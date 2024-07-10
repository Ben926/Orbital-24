import React, { createContext, useContext, useState } from 'react';

interface UserContextType {
  userID: string | null;
  setUserID: (id: string | null) => void;
  refreshUserData: boolean;
  setRefreshUserData: (state: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC = ({ children }) => {
  const [userID, setUserID] = useState<string | null>(null);
  const [refreshUserData, setRefreshUserData] = useState<boolean>(false);

  return (
    <UserContext.Provider value={{ userID, setUserID, refreshUserData, setRefreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
