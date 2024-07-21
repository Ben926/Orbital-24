import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import StockPrice from '../StockPrice';
import { getStockHistory, getStockPrice } from '@/alphaVantageAPI';
import { ActivityIndicator, Text } from 'react-native';

jest.mock('@/alphaVantageAPI');

const mockSymbol = 'AAPL';

const mockPriceData = {
  '2023-07-21': {
    '1. open': '150.00',
  },
};

const mockHistoryData = [
  { date: '2023-07-21', open: 150, high: 155, low: 149, close: 152, volume: 1000000 },
  { date: '2023-07-20', open: 148, high: 151, low: 147, close: 150, volume: 900000 },
  
];


const mockGetStockPrice = getStockPrice as jest.MockedFunction<typeof getStockPrice>;
const mockGetStockHistory = getStockHistory as jest.MockedFunction<typeof getStockHistory>;

describe('StockPrice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading indicator initially', () => {
    mockGetStockPrice.mockResolvedValueOnce(mockPriceData);
    mockGetStockHistory.mockResolvedValueOnce(mockHistoryData);

    const { getByTestId } = render(<StockPrice symbol={mockSymbol} />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('fetches and displays stock price', async () => {
    mockGetStockPrice.mockResolvedValueOnce(mockPriceData);
    mockGetStockHistory.mockResolvedValueOnce(mockHistoryData);

    const { getByText } = render(<StockPrice symbol={mockSymbol} />);

    await waitFor(() => {
      expect(getByText('AAPL')).toBeTruthy();
      expect(getByText('$150.00')).toBeTruthy();
     
    });
  });

  
});
