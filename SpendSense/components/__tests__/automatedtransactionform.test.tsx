import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AutomatedTransactionForm from '../AutomatedTransactionForm';
import { useUser } from '@/contexts/UserContext';
import { useFetchCategories } from '@/utils/useFetchCategories';
import supabase from '@/supabase/supabase';
import ModalSelector from 'react-native-modal-selector';
import { Alert } from 'react-native';

jest.mock('@/supabase/supabase');
jest.mock('@/contexts/UserContext');
jest.mock('@/utils/useFetchCategories');
jest.mock('react-native-modal-selector', () => 'ModalSelector');
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

const userID = 'user-1';

const mockCategories = [
  { id: '1', user_id: userID, name: 'Food', log: 'log1', outflow: true, color: '#000000' },
  { id: '2', user_id: userID, name: 'Transport', log: 'log2', outflow: true, color: '#000001' },
];

describe('AutomatedTransactionForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useUser as jest.Mock).mockReturnValue({
      userID,
      setRefreshUserData: jest.fn(),
    });

    (useFetchCategories as jest.Mock).mockReturnValue({
      categories: mockCategories,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
    });
  });

  test('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<AutomatedTransactionForm />);

    expect(getByText('Automate New Transaction')).toBeTruthy();
    expect(getByPlaceholderText('Amount')).toBeTruthy();
    expect(getByPlaceholderText('Description (optional)')).toBeTruthy();
  });

  test('displays categories correctly', () => {
    const { getByText } = render(<AutomatedTransactionForm />);

    expect(getByText('Food')).toBeTruthy();
    expect(getByText('Transport')).toBeTruthy();
  });

  test('validates input and displays error messages', async () => {
    const { getByText, getByPlaceholderText } = render(<AutomatedTransactionForm />);

    fireEvent.press(getByText('Automate!'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Please select category and input a non-zero amount!');
    });

    fireEvent.changeText(getByPlaceholderText('Amount'), '.');
    fireEvent.press(getByText('Food'));
    fireEvent.press(getByText('Automate!'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Key in a valid amount');
    });

    fireEvent.changeText(getByPlaceholderText('Amount'), '0');
    fireEvent.press(getByText('Automate!'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Amount cannot be zero!');
    });
  });

  test('renders correctly and changes frequency without errors', () => {
    const { getByText, getByPlaceholderText } = render(<AutomatedTransactionForm />);

    expect(getByText('Automate New Transaction')).toBeTruthy();
    expect(getByPlaceholderText('Amount')).toBeTruthy();
    expect(getByPlaceholderText('Description (optional)')).toBeTruthy();

 
    fireEvent.press(getByText('Food'));


    fireEvent.changeText(getByPlaceholderText('Amount'), '100');


    fireEvent.changeText(getByPlaceholderText('Description (optional)'), 'Grocery shopping');

    fireEvent.press(getByText('Weekly'));
    expect(getByText('Weekly')).toBeTruthy();

    fireEvent.press(getByText('Monthly'));
    expect(getByText('Monthly')).toBeTruthy();

    fireEvent.press(getByText('Daily'));
    expect(getByText('Daily')).toBeTruthy();
  });

  

});
