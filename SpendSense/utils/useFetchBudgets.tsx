import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import supabase from '@/supabase/supabase';
import { getSingaporeDate } from "@/utils/getSingaporeDate";

export const useFetchBudgets = () => {
  const { userID, refreshUserData, setRefreshUserData, budgets, setBudgets } = useUser();
  const updateBudgets = async (amount: number, transactionDate: Date | string, deleting: boolean = false) => {
    if (amount > 0) {
      return;
    }

    if (deleting) {
      for (const budget of budgets) {
        if (new Date(budget.start_date) <= transactionDate && new Date(budget.end_date) > transactionDate) {
          budget.amount_spent += amount;

          const { error } = await supabase
            .from(`budget_plan`)
            .update({ amount_spent: budget.amount_spent })
            .eq('id', budget.id)
            .eq('user_id', userID);

          if (error) {
            console.error('Error updating budgets:', error);
          }
        }
      }
    } else {
      for (const budget of budgets) {
        if (getSingaporeDate(new Date(budget.start_date)) <= transactionDate
          && getSingaporeDate(new Date(budget.end_date)) > transactionDate) {
          budget.amount_spent -= amount;

          const { error } = await supabase
            .from(`budget_plan`)
            .update({ amount_spent: budget.amount_spent })
            .eq('id', budget.id)
            .eq('user_id', userID);

          if (error) {
            console.error('Error updating budgets:', error);
          }
        }
      }
    }
  };

  useEffect(() => {
    const fetchBudgets = async () => {
      const { data, error } = await supabase
        .from('budget_plan')
        .select('*')
        .eq('user_id', userID);
      if (error) {
        console.error(error);
      } else {
        setBudgets(data);
        setRefreshUserData(false);
      }
    };
    fetchBudgets();
  }, [userID, refreshUserData]);

  return { budgets, setBudgets, setRefreshUserData, updateBudgets };
};
