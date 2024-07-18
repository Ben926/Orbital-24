import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LogInForm from '@/app/LogInForm';
import supabase from '../supabase/supabase';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../contexts/UserContext';

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    back: jest.fn(),
  },
}));

jest.mock('../supabase/supabase', () => ({
  auth: {
    signInWithPassword: jest.fn(),
    resetPasswordForEmail: jest.fn(),
  },
}));

jest.mock('../contexts/UserContext', () => ({
  useUser: jest.fn(() => ({
    setUserID: jest.fn(),
  })),
}));

const mockSignInWithPassword = supabase.auth.signInWithPassword as jest.Mock;
const mockResetPasswordForEmail = supabase.auth.resetPasswordForEmail as jest.Mock;
const mockSetUserID = useUser().setUserID as jest.Mock;

describe('LogInForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LogInForm />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Forgot Password?')).toBeTruthy();
    expect(getByText('Log In')).toBeTruthy();
    expect(getByText('Back')).toBeTruthy();
  });

  it('handles login error', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({ data: null, error: { message: 'Login error' } });

    const { getByPlaceholderText, getByText } = render(<LogInForm />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Log In'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Login Error', 'Login error');
    });
  });

  it('handles successful login', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({ data: { user: { id: 'user-id' } }, error: null });

    const { getByPlaceholderText, getByText } = render(<LogInForm />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Log In'));

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Logged in successfully');
      expect(router.replace).toHaveBeenCalledWith('Home');
    });
  });

  it('handles forgot password', async () => {
    mockResetPasswordForEmail.mockResolvedValueOnce({});

    const { getByPlaceholderText, getByText } = render(<LogInForm />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.press(getByText('Forgot Password?'));

    await waitFor(() => {
      expect(mockResetPasswordForEmail).toHaveBeenCalledWith('test@example.com');
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Password reset email sent.');
    });
  });

  it('handles forgot password error', async () => {
    mockResetPasswordForEmail.mockRejectedValueOnce({ message: 'Reset password error' });

    const { getByPlaceholderText, getByText } = render(<LogInForm />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.press(getByText('Forgot Password?'));

    await waitFor(() => {
      expect(mockResetPasswordForEmail).toHaveBeenCalledWith('test@example.com');
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Reset password error');
    });
  });

  it('shows error if email is not provided for forgot password', async () => {
    const { getByText } = render(<LogInForm />);
    fireEvent.press(getByText('Forgot Password?'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter your email address to reset your password.');
    });
  });
});

