import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, InteractionManagerStatic } from 'react-native';
import StockPrice from '@/components/StockPrice';
import styles from "@/styles/styles";
import supabase from "@/supabase/supabase";


type Stock = {
  id: number,
  symbol: string,
  name: string
}
const SearchBar = () => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Stock[]>([]);


  const fetchSuggestions = async (text) => {
    setQuery(text);
    if (text.length >= 1) {
      try {
        let { data, error } = await supabase
          .from('stocks')
          .select('id, symbol, name')
          .ilike('symbol', `%${text}%`); 
  
        if (error) {
          console.error('Error fetching suggestions:', error);
        } else {
          setSuggestions(data ?? []);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleStockSelection = (symbol: string) => {
    setSelectedStock(symbol);
    setQuery('');
    setSuggestions([]);
  };
  return (
    <View style={styles.loginContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for a stock symbol"
          placeholderTextColor="black"
          value={query}
          onChangeText={fetchSuggestions}
        />
        {query && <FlatList
          data={suggestions}
          keyExtractor={(item) => item.symbol}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleStockSelection(item.symbol)}>
              <Text style={styles.suggestionItem}>{item.symbol}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsList}
        />}
      {selectedStock && <StockPrice symbol={selectedStock} />}
    </View>
    
  );
};



export default SearchBar;
