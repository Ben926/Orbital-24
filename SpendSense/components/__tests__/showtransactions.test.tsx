import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Picker } from '@react-native-picker/picker';
import ShowTransactions from '../ShowTransactions';
import supabase from '@/supabase/supabase';
import { useUser } from '@/contexts/UserContext';
import { useFetchBudgets } from '@/utils/useFetchBudgets';
import { useFetchGoals } from '@/utils/useFetchGoals';

jest.mock('@/supabase/supabase');
jest.mock('@/contexts/UserContext');
jest.mock('@/utils/useFetchBudgets');
jest.mock('@/utils/useFetchGoals');


const mockTransactions = [
  {
    id: '1',
    user_id: 'user-1',
    log: 'log1',
    category: 'Food',
    amount: 10,
    timestamp: '2023-07-10T14:48:00.000Z',
    description: 'Lunch',
    color: 'red'
  },
  {
    id: '2',
    user_id: 'user-1',
    log: 'log2',
    category: 'Transport',
    amount: -5,
    timestamp: '2023-07-10T15:00:00.000Z',
    description: 'Bus fare',
    color: 'blue'
  }
];

const mockGoals = [
  {
    id: 'goal-1',
    user_id: 'user-1',
    goal_name: 'Save for vacation',
    target_amount: 1000,
    current_amount: 200,
    start_date: '2023-01-01',
    description: 'Save money for a trip to Bali'
  }
];

const mockBudgets = [
  {
    id: 'budget-1',
    user_id: 'user-1',
    budget_amount: 500,
    amount_spent: 150,
    start_date: '2023-07-01',
    end_date: '2023-07-31',
    description: 'Monthly food budget'
  }
];

const userID = 'user-1';

describe('ShowTransactions', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      userID,
      setUserID: jest.fn(),
      refreshUserData: false,
      setRefreshUserData: jest.fn(),
      budgets: mockBudgets,
      setBudgets: jest.fn(),
      goals: mockGoals,
      setGoals: jest.fn(),
      categories: [],
      setCategories: jest.fn(),
      automatedTransactions: [],
      setAutomatedTransactions: jest.fn()
    });

    (useFetchBudgets as jest.Mock).mockReturnValue({
      budgets: mockBudgets,
      updateBudgets: jest.fn(),
      setBudgets: jest.fn(),
      setRefreshUserData: jest.fn()
    });

    (useFetchGoals as jest.Mock).mockReturnValue({
      goals: mockGoals,
      updateGoalAmounts: jest.fn(),
      setGoals: jest.fn(),
      setRefreshUserData: jest.fn()
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockTransactions, error: null }),
      delete: jest.fn().mockReturnThis()
    });
  });

  it('should render loading indicator initially', async () => {
    const { getByTestId } = render(<ShowTransactions startDate="2000-01-01T00:00:00Z" endDate="2100-01-01T00:00:00Z" showChart={true} showAll={true} />);
    await act(async () => {
      expect(getByTestId('loading-indicator')).toBeTruthy();
    });
  });

  it('should fetch and display transactions', async () => {
    const { getByText } = render(<ShowTransactions startDate="2000-01-01T00:00:00Z" endDate="2100-01-01T00:00:00Z" showChart={true} showAll={true} />);
    await act(async () => {
      await waitFor(() => {
        expect(getByText('Lunch')).toBeTruthy();
        expect(() => getByText('Bus fare'));
      });
    });
  });

  it('should display pie chart and toggle between inflow and outflow', async () => {
    const { getByText } = render(<ShowTransactions startDate="2000-01-01T00:00:00Z" endDate="2100-01-01T00:00:00Z" showChart={true} showAll={true} />);
    await act(async () => {
      await waitFor(() => {
        expect(getByText('Outflow')).toBeTruthy();
      });
      fireEvent.press(getByText('Outflow'));
      await waitFor(() => {
        expect(getByText('Inflow')).toBeTruthy();
      });
    });
  });

  it('should filter transactions by category', async () => {
    const { getByText, getByTestId, queryByText } = render(<ShowTransactions startDate="2000-01-01T00:00:00Z" endDate="2100-01-01T00:00:00Z" showChart={true} showAll={true} />);
    await act(async () => {
      await waitFor(() => {
        fireEvent.press(getByText('Filter'));
      });
      await waitFor(() => {
        fireEvent(getByTestId('category-picker'), 'onValueChange', 'Food');
      });
      await waitFor(() => {
        fireEvent.press(getByText('Done'));
      });
      await waitFor(() => {
        expect(getByText('Lunch')).toBeTruthy();
        expect(queryByText('Bus fare')).toBeNull();
      });
    });
  });

  it('should delete a transaction', async () => {
    const { getByText, getAllByText} = render(<ShowTransactions startDate="2000-01-01T00:00:00Z" endDate="2100-01-01T00:00:00Z" showChart={true} showAll={true} />);
    await act(async () => {
      await waitFor(() => {
        expect(getByText('Lunch')).toBeTruthy();
      });
      const deleteButtons = getAllByText('x');
      fireEvent.press(deleteButtons[0]);
      await waitFor(() => {
        expect(supabase.from('raw_records').delete).toHaveBeenCalledWith();
      });
    });
  });
});
