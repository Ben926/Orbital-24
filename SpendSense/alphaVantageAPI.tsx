import axios from 'axios';

const API_KEY = '75XPT1E7IEU1U5UP';
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
