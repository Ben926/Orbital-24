import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import CreateTransactionForm from '../TransactionForm';
import { useUser } from '@/contexts/UserContext';
import { useFetchBudgets } from '@/utils/useFetchBudgets';
import { useFetchGoals } from '@/utils/useFetchGoals';
import { useFetchCategories } from '@/utils/useFetchCategories';
import { Alert } from 'react-native';
import supabase from '@/supabase/supabase';

jest.mock('@/supabase/supabase');
jest.mock('@/contexts/UserContext');
jest.mock('@/utils/useFetchBudgets');
jest.mock('@/utils/useFetchGoals');
jest.mock('@/utils/useFetchCategories');
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

const userID = 'user-1';

const mockCategories = [
  { id: '1', user_id: userID, name: 'Food', log: 'log1', outflow: true, color: '#000000' },
  { id: '2', user_id: userID, name: 'Transport', log: 'log2', outflow: true, color: '#000001' },
];

describe('CreateTransactionForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();

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

    (useFetchCategories as jest.Mock).mockReturnValue({
      categories: mockCategories,
      setCategories: jest.fn(),
      setRefreshUserData: jest.fn()
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis()
    });
  });

  test('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<CreateTransactionForm />);

    expect(getByText('Create Transaction')).toBeTruthy();
    expect(getByPlaceholderText('Amount')).toBeTruthy();
    expect(getByPlaceholderText('Description (optional)')).toBeTruthy();
  });

  test('displays categories correctly', () => {
    const { getByText } = render(<CreateTransactionForm />);

    expect(getByText('Food')).toBeTruthy();
    expect(getByText('Transport')).toBeTruthy();
  });

  test('validates input and displays error messages', async () => {
    const { getByText, getByPlaceholderText } = render(<CreateTransactionForm />);

    fireEvent.press(getByText('Submit'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Please select category and input a non-zero amount!'
      );
    });

    fireEvent.changeText(getByPlaceholderText('Amount'), '.');
    fireEvent.press(getByText('Food'));
    fireEvent.press(getByText('Submit'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Key in a valid amount'
      );
    });

    fireEvent.changeText(getByPlaceholderText('Amount'), '0');
    fireEvent.press(getByText('Submit'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Amount cannot be zero!'
      );
    });
  });

  test('creates a transaction successfully', async () => {
    const { getByText, getByPlaceholderText } = render(<CreateTransactionForm />);
    fireEvent.changeText(getByPlaceholderText('Amount'), '50');
    fireEvent.press(getByText('Food'));
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Success', 'Transaction created successfully!'
      );
    });
  });

  test('creates a backdated transaction successfully', async () => {
    const { getByText, getByPlaceholderText } = render(<CreateTransactionForm />);
    fireEvent.changeText(getByPlaceholderText('Amount'), '50');
    fireEvent.press(getByText('Food'));
    fireEvent.press(getByText('Submit'));
    fireEvent.press(getByText('Backdate Transaction'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Success', 'Transaction created successfully!'
      );
    });
  });

  it('should add a category', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<CreateTransactionForm />);

    // Open add category modal
    fireEvent.press(getByText('+ Add'));

    // Enter category name
    fireEvent.changeText(getByPlaceholderText('New Category'), 'Groceries');

    // Add category
    fireEvent.press(getByText('Add Category'));

    await waitFor(() => {
      expect(getByText('Create Transaction')).toBeTruthy(); // Modal should disappear
    });
  });

  it('should not add a category if the field is empty', async () => {
    const { getByText } = render(<CreateTransactionForm />);

    // Open add category modal
    fireEvent.press(getByText('+ Add'));

    // Add category
    fireEvent.press(getByText('Add Category'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Please enter a category name'
      );
    });
  });

  it('should edit a category', async () => {
    const { getAllByText, getByText, getByPlaceholderText } = render(<CreateTransactionForm />);

    // Open edit category modal
    fireEvent.press(getByText('Edit Categories'));

    const transportElements = getAllByText('Transport');

    fireEvent.press(transportElements[1]);

    fireEvent.changeText(getByPlaceholderText('New Category Name'), 'Groceries');

    // Save changes
    fireEvent.press(getByText('Save Changes'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Category updated successfully'
      );
    });
  });

  it('should delete a category', async () => {
    const { getAllByText, getByText } = render(<CreateTransactionForm />);

    // Open edit category modal
    fireEvent.press(getByText('Edit Categories'));

    const transportElements = getAllByText('Transport');

    // Select category to edit
    fireEvent.press(transportElements[1]);

    // Delete category
    fireEvent.press(getByText('Delete Category'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Category deleted successfully'
      );
    });
  });
});
