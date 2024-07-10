import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import StockPrice from '@/components/StockPrice';
import styles from "@/styles/styles";

const Stocks = () => {
  return (
    <SafeAreaView style={styles.indexContainer}>
      <StockPrice symbol="AAPL" />
      <StockPrice symbol="GOOGL" />
    </SafeAreaView>
  );
};



export default Stocks;
