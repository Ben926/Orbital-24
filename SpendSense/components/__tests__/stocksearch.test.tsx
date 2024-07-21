import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SearchBar from '../SearchBar';
import supabase from '@/supabase/supabase';
import { Text } from 'react-native';

jest.mock('@/supabase/supabase');

jest.mock('@/components/StockPrice', () => (props) => {
  const { Text } = require('react-native');
  return <Text>Stock Price for {props.symbol}</Text>;
});

const mockStocks = [
  { id: 1, symbol: 'AAPL', name: 'Apple Inc.' },
  { id: 2, symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { id: 3, symbol: 'AMZN', name: 'Amazon.com Inc.' },
];

describe('SearchBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    const mockSelect = jest.fn().mockReturnThis();
    const mockIlike = jest.fn().mockResolvedValue({ data: mockStocks, error: null });

    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
      ilike: mockIlike,
    });
  });

  test('renders correctly and fetches suggestions', async () => {
    const { getByPlaceholderText, getByText } = render(<SearchBar />);
    
    const searchInput = getByPlaceholderText('Search for a stock symbol');
    fireEvent.changeText(searchInput, 'AAPL');

    await waitFor(() => {
      expect(getByText('AAPL')).toBeTruthy();
      expect(getByText('GOOGL')).toBeTruthy();
      expect(getByText('AMZN')).toBeTruthy();
    });
  });

  test('selects a stock and displays stock price', async () => {
    const { getByPlaceholderText, getByText } = render(<SearchBar />);
    
    const searchInput = getByPlaceholderText('Search for a stock symbol');
    fireEvent.changeText(searchInput, 'AAPL');

    await waitFor(() => {
      expect(getByText('AAPL')).toBeTruthy();
    });

    fireEvent.press(getByText('AAPL'));

    await waitFor(() => {
      expect(getByText('Stock Price for AAPL')).toBeTruthy();
    });
  });

  test('clears suggestions after selecting a stock', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<SearchBar />);

    const searchInput = getByPlaceholderText('Search for a stock symbol');
    fireEvent.changeText(searchInput, 'AAPL');

    await waitFor(() => {
      expect(getByText('AAPL')).toBeTruthy();
    });

    fireEvent.press(getByText('AAPL'));

    await waitFor(() => {
      expect(queryByText('AAPL')).toBeNull();
    });
  });
});
