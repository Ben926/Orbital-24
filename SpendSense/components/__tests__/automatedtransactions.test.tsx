import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import AutomatedTransactionsPage from '@/components/AutomatedTransactions';
import { useUser } from '@/contexts/UserContext';
import { useFetchAutomatedTransactions } from '@/utils/useFetchAutomatedTransactions';
import supabase from '@/supabase/supabase';

jest.mock('@/supabase/supabase');
jest.mock('@/contexts/UserContext');
jest.mock('@/utils/useFetchAutomatedTransactions');
jest.mock('@/components/AutomatedTransactionForm', () => 'AutomatedTransactionForm');

const userID = 'user-1';

const mockAutomatedTransactions = [
    {
        id: 'transaction-1',
        user_id: userID,
        description: 'Automated transaction 1',
        category: 'Category 1',
        next_execution_date: '2024-07-28 00:00:00',
        frequency: 'Monthly',
        amount: 100,
        color: '#FF5733',
        day: 28
    },
    {
        id: 'transaction-2',
        user_id: userID,
        description: 'Automated transaction 2',
        category: 'Category 2',
        next_execution_date: '2024-08-15 00:00:00',
        frequency: 'Weekly',
        amount: -50,
        color: '#33FF57',
        day: 5
    }
];

describe('AutomatedTransactionsPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useUser as jest.Mock).mockReturnValue({
            userID,
            setRefreshUserData: jest.fn()
        });

        (useFetchAutomatedTransactions as jest.Mock).mockReturnValue({
            automatedTransactions: mockAutomatedTransactions,
            updateAutomatedTransactions: jest.fn()
        });

        (supabase.from as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            single: jest.fn().mockReturnThis()
        });
    });

    test('renders correctly', () => {
        const { getByText } = render(<AutomatedTransactionsPage />);

        expect(getByText('Automated transaction 1')).toBeTruthy();
        expect(getByText('Automated transaction 2')).toBeTruthy();
        expect(getByText('Next Transaction Date: Sunday, July 28 (Monthly)')).toBeTruthy();
        expect(getByText('Next Transaction Date: Thursday, August 15 (Weekly)')).toBeTruthy();
        expect(getByText('+$100')).toBeTruthy();
        expect(getByText('-$50')).toBeTruthy();
    });


    test('updates automated transactions', async () => {
        const { getByText } = render(<AutomatedTransactionsPage />);
        const updateAutomatedTransactionsMock = useFetchAutomatedTransactions().updateAutomatedTransactions;

        await act(async () => {
            fireEvent.press(getByText('Update Automations!'));
        });

        expect(updateAutomatedTransactionsMock).toHaveBeenCalled();
    });

    test('deletes an automated transaction', async () => {
        const { getByText, getAllByText} = render(<AutomatedTransactionsPage />);
        const deleteButtons = getAllByText('x');
        fireEvent.press(deleteButtons[0]);
        await waitFor(() => {
            expect(supabase.from('automated_transactions').delete).toHaveBeenCalledWith();
        });
    });
});
