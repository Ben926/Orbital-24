import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { getStockPrice } from '@/alphaVantageAPI';
import styles from '@/styles/styles';

const StockPrice = ({ symbol }) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockPrice = async () => {
      const data = await getStockPrice(symbol);
      if (data) {
        const latestTime = Object.keys(data)[0];
        const latestPrice = data[latestTime]['1. open'];
        setPrice(latestPrice);
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
    </View>
  );
};



export default StockPrice;
