import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ShowTransactions from '../ShowTransactions';
import supabase from '@/supabase/supabase';
import { useUser } from '@/contexts/UserContext';
import { useFetchBudgets } from '@/utils/useFetchBudgets';
import { useFetchGoals } from '@/utils/useFetchGoals';
import Home from "@/app/(pages)/Home";
import { getSingaporeDate } from '@/utils/getSingaporeDate';

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
    timestamp: getSingaporeDate().toISOString(),
    description: 'Lunch',
    color: 'red'
  },
  {
    id: '2',
    user_id: 'user-1',
    log: 'log2',
    category: 'Transport',
    amount: -5,
    timestamp: getSingaporeDate(new Date(Date.now() - 28 * 60 * 60 * 1000)).toISOString(), 
    description: 'Bus fare',
    color: 'blue'
  },
  {
    id: '3',
    user_id: 'user-1',
    log: 'log3',
    category: 'Entertainment',
    amount: -20,
    timestamp: getSingaporeDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).toISOString(), 
    description: 'Movie ticket',
    color: 'green'
  },
  {
    id: '4',
    user_id: 'user-1',
    log: 'log4',
    category: 'Groceries',
    amount: -30,
    timestamp: getSingaporeDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).toISOString(), 
    description: 'Grocery shopping',
    color: 'yellow'
  },

];


const userID = 'user-1';

describe('ShowTransactions', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      userID,
      setUserID: jest.fn(),
      refreshUserData: false,
      setRefreshUserData: jest.fn(),
      budgets: [],
      setBudgets: jest.fn(),
      goals: [],
      setGoals: jest.fn(),
      categories: [],
      setCategories: jest.fn(),
      automatedTransactions: [],
      setAutomatedTransactions: jest.fn()
    });

    (useFetchBudgets as jest.Mock).mockReturnValue({
      budgets: [],
      updateBudgets: jest.fn(),
      setBudgets: jest.fn(),
      setRefreshUserData: jest.fn()
    });

    (useFetchGoals as jest.Mock).mockReturnValue({
      goals: [],
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
    const { getByText, getAllByText } = render(<ShowTransactions startDate="2000-01-01T00:00:00Z" endDate="2100-01-01T00:00:00Z" showChart={true} showAll={true} />);
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


  it('should toggle to see all transactions made in that day', async () => {
    const { getByText, queryByText } = render(<Home />);

    fireEvent.press(getByText('Daily'));

    await waitFor(() => {
      expect(getByText("Lunch")).toBeTruthy(); // Check only daily transactions are shown
    });
  });

  it('should toggle to see all transactions made in that week', async () => {
    const { getByText, queryByText } = render(<Home />);

    fireEvent.press(getByText('Weekly'));

    await waitFor(() => {
      expect(getByText("Bus fare")).toBeTruthy(); // Check only weekly transactions are shown
    });
  });

  it('should toggle to see all transactions made in that month', async () => {
    const { getByText, queryByText } = render(<Home />);

    fireEvent.press(getByText('Monthly'));

    await waitFor(() => {
      expect(getByText("Grocery shopping")).toBeTruthy(); // Check only monthly transactions are shown
    });
  });

  it('should toggle to see all transactions made in the manual period', async () => {
    const { getByText, queryByText } = render(<Home />);

    fireEvent.press(getByText('Manual'));

    await waitFor(() => {
      expect(getByText("Bus fare")).toBeTruthy();
    });
  });
});

