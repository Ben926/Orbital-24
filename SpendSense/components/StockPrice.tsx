import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getStockHistory, getStockPrice } from '@/alphaVantageAPI';
import styles from '@/styles/styles';

type StockHistoryEntry = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

const StockPrice = ({ symbol }) => {
  const [price, setPrice] = useState(null);
  const [history, setHistory] = useState<StockHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockPrice = async () => {
      const priceData = await getStockPrice(symbol);
      const historyData = await getStockHistory(symbol);
      if (priceData) {
        const latestTime = Object.keys(priceData)[0];
        const latestPrice = priceData[latestTime]['1. open'];
        setPrice(latestPrice);
      }
      if (historyData) {
        setHistory(historyData);
      }
      setLoading(false);
    };

    fetchStockPrice();
  }, [symbol]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  

  return (
    <View style={styles.indexContainer}>
      <Text style={styles.stockSymbol}>{symbol}</Text>
      <Text style={styles.stockPrice}>${price}</Text>
      <LineChart
      data={{
        labels: history.map((entry, index) => (index % 5 === 0 ? entry.date : '')),
        datasets: [
          {
            data: history.map(entry => entry.close),
          },
        ],
      }}
      width={320}
        height={220}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
      />
      <View>
        <Text>High: {Math.max(...history.map(entry => entry.high))}</Text>
        <Text>Low: {Math.min(...history.map(entry => entry.low))}</Text>
        <Text>Open: {history[0]?.open}</Text>
        <Text>Close: {history[history.length - 1]?.close}</Text>
      </View>
    </View>
  );
};



export default StockPrice;
