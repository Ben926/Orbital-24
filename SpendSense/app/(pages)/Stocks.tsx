import React, { useState } from 'react';
import { SafeAreaView} from 'react-native';
import styles from "@/styles/styles";
import SearchBar from '@/components/SearchBar';
import { DescriptionText } from "@/components/DescriptionText";

const Stocks = () => {
  const header = "Stock Overview"
  const description = "Stay informed about the latest market trends and track the performance of your favorite stocks!"
  return (
    <SafeAreaView style={styles.indexContainer}>
      <SearchBar/>
      <DescriptionText header={header} description={description}/>
    </SafeAreaView>
    
  );
};



export default Stocks;
