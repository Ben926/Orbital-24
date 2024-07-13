import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import supabase from '@/supabase/supabase';
import { getSingaporeDate } from "@/utils/getSingaporeDate";
import { useFetchBudgets } from '@/utils/useFetchBudgets';
import { useFetchGoals } from '@/utils/useFetchGoals';

export const useFetchAutomatedTransactions = () => {
  const { userID, refreshUserData, setRefreshUserData, automatedTransactions, setAutomatedTransactions } = useUser();
  const { updateBudgets } = useFetchBudgets();
  const { updateGoalAmounts } = useFetchGoals();

  useEffect(() => {
    const fetchAutomatedTransactions = async () => {
      const { data, error } = await supabase
        .from('automated_transactions')
        .select('*')
        .eq('user_id', userID);
      if (error) {
        console.error(error);
      } else {
        setAutomatedTransactions(data);
        setRefreshUserData(false);
      }
    };
    fetchAutomatedTransactions();
  }, [refreshUserData]);

  const updateAutomatedTransactions = async () => {
    for (const automatedTransaction of automatedTransactions) {
      let nextExecutionDate = new Date(automatedTransaction.next_execution_date);
      let timestamp = new Date(automatedTransaction.next_execution_date);
      while (nextExecutionDate <= new Date()) {
        switch (automatedTransaction.frequency) {
          case 'Daily':
            timestamp.setMonth(nextExecutionDate.getMonth());
            timestamp.setDate(nextExecutionDate.getDate());
            nextExecutionDate.setDate(nextExecutionDate.getDate() + 1);
            break;
          case 'Weekly':
            timestamp.setMonth(nextExecutionDate.getMonth());
            timestamp.setDate(nextExecutionDate.getDate());
            nextExecutionDate.setDate(nextExecutionDate.getDate() + 7);
            break;
          case 'Monthly':
            timestamp.setMonth(nextExecutionDate.getMonth());
            timestamp.setDate(nextExecutionDate.getDate());
            nextExecutionDate.setMonth(nextExecutionDate.getMonth() + 1);
            break;

        }

        const newTransaction = {
          user_id: userID,
          amount: automatedTransaction.amount,
          category: automatedTransaction.category,
          log: getSingaporeDate(),
          description: automatedTransaction.description,
          timestamp: getSingaporeDate(timestamp),
          color: automatedTransaction.color
        };
        try {
          const { error } = await supabase
            .from(`raw_records`)
            .insert([newTransaction])
            .select();
          if (error) {
            console.error('Error creating transaction:', error);
          } else {
            await updateGoalAmounts(newTransaction.amount, newTransaction.timestamp);
            await updateBudgets(newTransaction.amount, newTransaction.timestamp);
          }
        } catch (err) {
          console.error('Unexpected error creating transaction:', err);
        }

        try {
          const { error } = await supabase
            .from('automated_transactions')
            .update({ next_execution_date: getSingaporeDate(nextExecutionDate) })
            .eq('id', automatedTransaction.id);
          if (error) {
            console.error(`Error updating automated transaction ${automatedTransaction.id}:`, error);
          } else {

          }
        } catch (err) {
          console.error('Unexpected error updating automated transaction:', err);
        }
      }
    }
    setRefreshUserData(true);
  };

  return { automatedTransactions, setAutomatedTransactions, setRefreshUserData, updateAutomatedTransactions };
};