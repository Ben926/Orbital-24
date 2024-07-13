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

  const formatMonth = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short' });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  

  return (
    <View style={styles.indexContainer}>
      <View style={styles.stockPriceContainer}>
        <Text style={styles.stockSymbol}>{symbol}</Text>
        <Text style={styles.stockPrice}>${price}</Text>
      </View>
      <LineChart
      data={{
        labels: history.map((entry, index) => (index % 5 === 0 ? formatMonth(entry.date) : '')),
        datasets: [
          {
            data: history.map(entry => entry.close),
          },
        ],
      }}
      width={320}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '0'
          },
        }}
        style={styles.stockChart}
      />
      <View style={styles.stockStatsContainer}>
        <Text style={styles.stockStatsText}>High: {Math.max(...history.map(entry => entry.high))}</Text>
        <Text style={styles.stockStatsText}>Low: {Math.min(...history.map(entry => entry.low))}</Text>
        <Text style={styles.stockStatsText}>Open: {history[0]?.open}</Text>
        <Text style={styles.stockStatsText}>Close: {history[history.length - 1]?.close}</Text>
      </View>
    </View>
  );
};



export default StockPrice;
