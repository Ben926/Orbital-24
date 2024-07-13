import axios from 'axios';

const API_KEY = 'CIIZCPW1EW8N6JVG';
const BASE_URL = 'https://www.alphavantage.co/query';

export const getStockPrice = async (symbol) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol: symbol,
        interval: '5min',
        apikey: API_KEY,
      },
    });
    return response.data['Time Series (5min)'];
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const getStockHistory = async (symbol) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        apikey: API_KEY,
      },
    });
    const timeSeries = response.data['Time Series (Daily)'];
    return Object.keys(timeSeries).slice(0, 30).map(date => ({
      date,
      open: timeSeries[date]['1. open'],
      high: timeSeries[date]['2. high'],
      low: timeSeries[date]['3. low'],
      close: timeSeries[date]['4. close'],
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};
