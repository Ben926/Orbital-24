import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import Goals from '../Goals';
import { useUser } from '@/contexts/UserContext';
import { useFetchGoals } from '@/utils/useFetchGoals';
import { Alert } from 'react-native';
import supabase from '@/supabase/supabase';

jest.mock('@/supabase/supabase');
jest.mock('@/contexts/UserContext');
jest.mock('@/utils/useFetchGoals');
jest.mock('react-native/Libraries/Alert/Alert', () => ({
    alert: jest.fn(),
}));

const userID = 'user-1';

const mockGoals = [
    {
        id: 'goal-1',
        user_id: userID,
        goal_name: 'Save for vacation',
        target_amount: 1000,
        current_amount: 200,
        start_date: '2023-01-01',
        description: 'Save money for a trip to Bali'
    }
];

describe('GoalPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useUser as jest.Mock).mockReturnValue({
            userID,
            setUserID: jest.fn(),
            refreshUserData: false,
            setRefreshUserData: jest.fn(),
            budgets: [],
            setBudgets: jest.fn(),
            goals: mockGoals,
            setGoals: jest.fn(),
            categories: [],
            setCategories: jest.fn(),
            automatedTransactions: [],
            setAutomatedTransactions: jest.fn()
        });

        (useFetchGoals as jest.Mock).mockReturnValue({
            goals: mockGoals,
            updateGoals: jest.fn(),
            setGoals: jest.fn(),
            setRefreshUserData: jest.fn()
        });

        (supabase.from as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            gte: jest.fn().mockReturnThis(),
            gt: jest.fn().mockReturnThis(),
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
        const { getByText } = render(<Goals />);

        expect(getByText('Save for vacation')).toBeTruthy();
        expect(getByText('Target Amount: $1000')).toBeTruthy();
        expect(getByText('Amount Saved: $200')).toBeTruthy();
    });

    it('should add a new goal successfully', async () => {
        const { getByText, getByPlaceholderText } = render(<Goals />);

        fireEvent.press(getByText('Add New Goal'));

        fireEvent.changeText(getByPlaceholderText('Goal'), 'Buy a car');
        fireEvent.changeText(getByPlaceholderText('Description (optional)'), 'Save for a new car');
        fireEvent.changeText(getByPlaceholderText('Target Amount'), '20000');

        await act(async () => {
            fireEvent.press(getByText('Save Goal'));
        });

        await waitFor(() => {
            expect(supabase.from('spending_goals').insert).toHaveBeenCalled();
        });
    });

    it('should not add a new goal if the goal name or the budget is empty', async () => {
        const { getByText, getByPlaceholderText } = render(<Goals />);

        fireEvent.press(getByText('Add New Goal'));

        await act(async () => {
            fireEvent.press(getByText('Save Goal'));
        });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                'Please fill in the goal and amount!'
            );
        });

        fireEvent.changeText(getByPlaceholderText('Goal'), 'Buy a car');
        fireEvent.changeText(getByPlaceholderText('Target Amount'), '');

        await act(async () => {
            fireEvent.press(getByText('Save Goal'));
        });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                'Please fill in the goal and amount!'
            );
        });
    });
    it('should delete a goal', async () => {
        const { getByText } = render(<Goals />);

        await act(async () => {
            fireEvent.press(getByText('x'));
        });

        await waitFor(() => {
            expect(supabase.from('spending_goals').delete).toHaveBeenCalledWith();
        });
    });
});
