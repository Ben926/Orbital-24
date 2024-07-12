import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import StockPrice from '@/components/StockPrice';
import styles from "@/styles/styles";
import axios from 'axios';
const Stocks = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (text) => {
    setQuery(text);
    if (text.length >= 1) {
      try {
        const response = await axios.get('https://www.alphavantage.co/query', {
          params: {
            function: 'SYMBOL_SEARCH',
            keywords: text,
            apikey: 'CIIZCPW1EW8N6JVG',
          },
        });
        console.log('API Response:', response.data.bestMatches);
        setSuggestions(response.data.bestMatches);
      } catch (error) {
        console.error(error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleStockSelection = (symbol) => {
    setSelectedStock(symbol);
    setQuery('');
    setSuggestions([]);
  };
  return (
    
    <SafeAreaView style={styles.indexContainer}>
      <TextInput
        style={styles.input}
        placeholder="Search for a stock symbol"
        value={query}
        onChangeText={fetchSuggestions}
      />
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item['1. symbol']}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleStockSelection(item['1. symbol'])}>
            <Text style={styles.suggestionItem}>{item['1. symbol']}</Text>
          </TouchableOpacity>
        )}
      />
      {selectedStock && <StockPrice symbol={selectedStock} />}
    </SafeAreaView>
  );
};



export default Stocks;
