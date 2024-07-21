import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ShowAnalytics from '../ShowAnalytics';
import { useUser } from '@/contexts/UserContext';
import supabase from '@/supabase/supabase';
import { getSingaporeDate } from '@/utils/getSingaporeDate';
import { Alert } from 'react-native';

jest.mock('@/supabase/supabase');
jest.mock('@/contexts/UserContext');
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

const userID = 'user-1';

const mockTransactions = [
  { id: '1', user_id: userID, log: 'log1', category: 'Food', amount: -50, timestamp: getSingaporeDate().toISOString(), description: 'Lunch', color: '#ff0000' },
  { id: '2', user_id: userID, log: 'log2', category: 'Transport', amount: -20, timestamp: getSingaporeDate().toISOString(), description: 'Bus fare', color: '#00ff00' },
  { id: '3', user_id: userID, log: 'log3', category: 'Salary', amount: 1000, timestamp: getSingaporeDate().toISOString(), description: 'Monthly salary', color: '#0000ff' },
];

describe('ShowAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useUser as jest.Mock).mockReturnValue({
      userID,
      refreshUserData: false,
      setRefreshUserData: jest.fn(),
    });

    (supabase.from as jest.Mock).mockImplementation((table) => {
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => {
          if (table === 'raw_records') {
            resolve({ data: mockTransactions, error: null });
          } else {
            resolve({ data: [], error: null });
          }
        }),
      };
    });
  });

  test('renders correctly and fetches transactions', async () => {
    const { getByText } = render(<ShowAnalytics />);

    await waitFor(() => {
      expect(getByText('Food')).toBeTruthy();
      expect(getByText('Transport')).toBeTruthy();
      expect(getByText('Salary')).toBeTruthy();
    });

    
    await waitFor(() => {
      //expect(getByText('You have saved $930.00 more this month so far compared to last month. (Net Total)')).toBeTruthy();
    });
    
  });

  test('changes time period and fetches data', async () => {
    const { getByText } = render(<ShowAnalytics />);

    fireEvent.press(getByText('This Week'));
    await waitFor(() => {
      //expect(getByText('You have saved $930.00 more this month so far compared to last month. (Net Total)')).toBeTruthy();
      expect(getByText('Food')).toBeTruthy();
      expect(getByText('Transport')).toBeTruthy();
      expect(getByText('Salary')).toBeTruthy();
    });

    fireEvent.press(getByText('This Month'));
    await waitFor(() => {
      //expect(getByText('You have saved $930.00 more this month so far compared to last month. (Net Total)')).toBeTruthy();
      expect(getByText('Food')).toBeTruthy();
      expect(getByText('Transport')).toBeTruthy();
      expect(getByText('Salary')).toBeTruthy();
    });

    fireEvent.press(getByText('Manual'));
    await waitFor(() => {
      //expect(getByText('You have saved $930.00 more this month so far compared to last month. (Net Total)')).toBeTruthy();
      expect(getByText('Food')).toBeTruthy();
      expect(getByText('Transport')).toBeTruthy();
      expect(getByText('Salary')).toBeTruthy();
    });
  });

  test('displays DateTimePicker for manual time period', async () => {
    const { getByText, getByTestId } = render(<ShowAnalytics />);

    fireEvent.press(getByText('Manual'));
    await waitFor(() => {
      expect(getByTestId('manualStartDatePicker')).toBeTruthy();
      expect(getByTestId('manualEndDatePicker')).toBeTruthy();
    });
  });

  test('handles loading state', async () => {
    const { getByText, queryByTestId } = render(<ShowAnalytics />);

    await waitFor(() => {
      expect(queryByTestId('ActivityIndicator')).toBeNull();
    });

    fireEvent.press(getByText('This Month'));
    await waitFor(() => {
      //expect(getByText('You have saved $930.00 more this month so far compared to last month. (Net Total)')).toBeTruthy();
      expect(getByText('Food')).toBeTruthy();
      expect(getByText('Transport')).toBeTruthy();
      expect(getByText('Salary')).toBeTruthy();
    });
  });
});
