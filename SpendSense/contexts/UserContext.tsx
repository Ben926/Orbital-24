import React, { createContext, useContext, useState } from 'react';

interface Budget {
  id: string;
  user_id: string;
  budget_amount: number;
  amount_spent: number;
  start_date: string;
  end_date: string;
  description: string;
}

interface Goal {
  id: string;
  user_id: string;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  start_date: string;
  description: string;
};

interface Category {
  id: string;
  user_id: string;
  name: string;
  log: string;
  outflow: boolean;
  color: string;
};

interface UserContextType {
  userID: string | null;
  setUserID: (id: string | null) => void;
  refreshUserData: boolean;
  setRefreshUserData: (state: boolean) => void;
  budgets: Budget[];
  setBudgets: (budgets: Budget[]) => void;
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC = ({ children }) => {
  const [userID, setUserID] = useState<string | null>(null);
  const [refreshUserData, setRefreshUserData] = useState<boolean>(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>([])

  return (
    <UserContext.Provider value={{
      userID, setUserID, 
      refreshUserData, setRefreshUserData, 
      budgets, setBudgets, 
      goals, setGoals,
      categories, setCategories,
    }}>
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
