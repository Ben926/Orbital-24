import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import Budgets from '../Budgets';
import { useUser } from '@/contexts/UserContext';
import { useFetchBudgets } from '@/utils/useFetchBudgets';
import { Alert } from 'react-native';
import supabase from '@/supabase/supabase';

jest.mock('@/supabase/supabase');
jest.mock('@/contexts/UserContext');
jest.mock('@/utils/useFetchBudgets');
jest.mock('react-native/Libraries/Alert/Alert', () => ({
    alert: jest.fn(),
}));

const userID = 'user-1';

const mockBudgets = [
    {
        id: 'budget-1',
        user_id: userID,
        budget_amount: 500,
        amount_spent: 150,
        start_date: '2023-07-01',
        end_date: '2023-07-31',
        description: 'Monthly food budget'
    }
];

describe('BudgetPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useUser as jest.Mock).mockReturnValue({
            userID,
            setUserID: jest.fn(),
            refreshUserData: false,
            setRefreshUserData: jest.fn(),
            budgets: mockBudgets,
            setBudgets: jest.fn(),
            goals: [],
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

        (supabase.from as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            gte: jest.fn().mockReturnThis(),
            lte: jest.fn().mockReturnThis(),
            lt: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            single: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis()
        });
    });

    test('renders correctly', () => {
        const { getByText } = render(<Budgets />);

        expect(getByText('Monthly food budget')).toBeTruthy();
        expect(getByText('$150 out of $500 spent!')).toBeTruthy();
    });

    it('should add a new budget successfully', async () => {
        const { getByText, getByPlaceholderText } = render(<Budgets />);

        fireEvent.press(getByText('Add New Budget'));

        fireEvent.changeText(getByPlaceholderText('Description (optional)'), 'Groceries');
        fireEvent.changeText(getByPlaceholderText('Budget Amount'), '1000');

        await act(async () => {
            fireEvent.press(getByText('Save Budget'));
        });

        await waitFor(() => {
            expect(supabase.from('budget_plan').insert).toHaveBeenCalled();
        });
    });

    it('should not add a new budget if the description or the budget is empty', async () => {
        const { getByText, getByPlaceholderText } = render(<Budgets />);

        fireEvent.press(getByText('Add New Budget'));

        await act(async () => {
            fireEvent.press(getByText('Save Budget'));
        });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                'Please fill in the budget amount!'
            );
        });
    });

    it('should delete a budget', async () => {
        const { getByText } = render(<Budgets />);

        await act(async () => {
            fireEvent.press(getByText('x'));
        });

        await waitFor(() => {
            expect(supabase.from('budget_plan').delete).toHaveBeenCalledWith();
        });
    });
});
