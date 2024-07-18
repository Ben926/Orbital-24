import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignUpForm from '@/app/SignUpForm';
import supabase from '../supabase/supabase';
import { Alert } from 'react-native';

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

jest.mock('../supabase/supabase', () => ({
  auth: {
    signUp: jest.fn(),
  },
  rpc: jest.fn(),
  from: jest.fn(() => ({
    insert: jest.fn(),
  })),
}));

const mockSignUp = supabase.auth.signUp as jest.Mock;
const mockRpc = supabase.rpc as jest.Mock;
const mockFrom = supabase.from as jest.Mock;

describe('SignUpForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<SignUpForm />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
    expect(getByText('Back')).toBeTruthy();
  });

  it('handles signup with mismatched passwords', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUpForm />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password456');
    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Signup Error',
        'Passwords do not match',
        
      );
    });
  });

  it('handles successful signup', async () => {
    mockSignUp.mockResolvedValueOnce({ data: { user: { id: 'user-id' } }, error: null });
    mockRpc.mockResolvedValueOnce({ error: null });
    mockFrom.mockReturnValueOnce({
      insert: jest.fn().mockResolvedValueOnce({ error: null })
    });

    const { getByPlaceholderText, getByText } = render(<SignUpForm />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');
    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
      expect(mockRpc).toHaveBeenCalledWith('create_user_table', { user_id: 'user-id' });
      expect(Alert.alert).toHaveBeenCalledWith(
        'Success!',
        'Account created successfully'
      );
    });
  });

  it('handles signup error from supabase', async () => {
    mockSignUp.mockResolvedValueOnce({ data: null, error: { message: 'Signup error' } });

    const { getByPlaceholderText, getByText } = render(<SignUpForm />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');
    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
      expect(Alert.alert).toHaveBeenCalledWith(
        'Signup Error',
        'Signup error',
        
      );
    });
  });
});
