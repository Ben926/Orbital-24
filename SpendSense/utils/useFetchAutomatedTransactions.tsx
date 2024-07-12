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
    let sum = 1;
    const newTransactions = [];
    for (const automatedTransaction of automatedTransactions) {
      let oldNextExecutionDate = new Date(automatedTransaction.next_execution_date);
      while (oldNextExecutionDate <= new Date()) {
        console.log(sum);
        sum += 1;
        let newNextExecutionDate = new Date();
        switch (automatedTransaction.frequency) {
          case 'Daily':
            newNextExecutionDate.setDate(oldNextExecutionDate.getDate() + 1);
            newNextExecutionDate.setHours(0, 0, 0, 0);
            oldNextExecutionDate = newNextExecutionDate;
            newNextExecutionDate = getSingaporeDate(newNextExecutionDate);
            break;
          case 'Weekly':
            const daysUntilNextWeek = 7 - oldNextExecutionDate.getDay(); // Days remaining in the current week
            newNextExecutionDate.setDate(oldNextExecutionDate.getDate() + daysUntilNextWeek); // Move to the next week's start
            newNextExecutionDate.setHours(0, 0, 0, 0); // Set to start of the day
            oldNextExecutionDate = newNextExecutionDate;
            newNextExecutionDate = getSingaporeDate(newNextExecutionDate);
            break;
          case 'Monthly':
            if (oldNextExecutionDate.getMonth() === 11) { // If it's December
              newNextExecutionDate = new Date(oldNextExecutionDate.getFullYear() + 1, 0, 1); // Set to January 1st of the next year
            } else {
              newNextExecutionDate = new Date(oldNextExecutionDate.getFullYear(), oldNextExecutionDate.getMonth() + 1, 1); // Set to the 1st of the next month
            }
            newNextExecutionDate.setHours(0, 0, 0, 0);
            oldNextExecutionDate = newNextExecutionDate;
            newNextExecutionDate = getSingaporeDate(newNextExecutionDate);
            break;
        }

        const newTransaction = {
          user_id: userID,
          amount: automatedTransaction.amount,
          category: automatedTransaction.category,
          log: getSingaporeDate(),
          description: automatedTransaction.description,
          timestamp: oldNextExecutionDate,
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
            .update({ next_execution_date: newNextExecutionDate })
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
