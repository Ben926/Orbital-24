import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import supabase from '@/supabase/supabase';
import { getSingaporeDate } from "@/utils/getSingaporeDate";

export const useFetchGoals = () => {
  const { userID, refreshUserData, setRefreshUserData, goals, setGoals } = useUser();

  useEffect(() => {
    const fetchGoals = async () => {
      const { data, error } = await supabase
        .from(`spending_goals`)
        .select('*')
        .eq('user_id', userID);
      if (error) {
        console.error(error);
      } else {
        setGoals(data);
        setRefreshUserData(false);
      }
    };
    fetchGoals();
  }, [refreshUserData]);

  const updateGoalAmounts = async (amount: number, transactionDate: Date | string, deleting: boolean = false) => {
    if (deleting) {
      for (const goal of goals) {
        if (new Date(goal.start_date) <= transactionDate) {
          goal.current_amount -= amount;

          const { error } = await supabase
            .from(`spending_goals`)
            .update({ current_amount: goal.current_amount })
            .eq('id', goal.id)
            .eq('user_id', userID);

          if (error) {
            console.error('Error updating goal amount:', error);
          }
        }
      }
    } else {
      for (const goal of goals) {
        if (getSingaporeDate(new Date(goal.start_date)) <= transactionDate) {
          goal.current_amount += amount;

          const { error } = await supabase
            .from(`spending_goals`)
            .update({ current_amount: goal.current_amount })
            .eq('id', goal.id)
            .eq('user_id', userID);

          if (error) {
            console.error('Error updating goal amount:', error);
          }
        }
      }
    }
  };

  return { goals, setGoals, setRefreshUserData, updateGoalAmounts };
};